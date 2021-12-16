import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import {
  translateText,
  detectText,
  detectWebEntities,
  detectLandmarks,
} from './services/detection';
import { createEncryptor } from 'simple-encryptor';
import { updateImage } from './services/image';
import { existsSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { PUBLIC_FOLDER } from './env.const';
import base64url from 'base64url';
import { uploadFile } from './services/storage';
config();

const cipher = createEncryptor({
  key: process.env.KEY!,
  hmac: true,
  debug: true,
});

const app = express();

app.use(cors());
app.use(morgan('tiny'));

if (!existsSync(PUBLIC_FOLDER)) {
  mkdirSync(PUBLIC_FOLDER);
}
app.use('/public', express.static(PUBLIC_FOLDER));

// Create multer object
const imageUpload = multer({
  storage: multer.memoryStorage(),
});

const port = process.env.PORT || 3000;

function removeDomainNames(text: string): string {
  return text
    .split(/[\s]+/)
    .filter(e => e.indexOf('.com') === -1)
    .join(' ');
}

function toHash(text: string) {
  return createHash('md5').update(text).digest('hex');
}

app.post('/parse/image', imageUpload.single('image'), async (req, res) => {
  if (req.file) {
    const uri = await uploadFile(req.file);
    res.json({
      id: base64url(cipher.encrypt(uri)),
      imageId: toHash(uri),
    });
  } else {
    res.sendStatus(400);
  }
});

app.get('/metadata/:id', async (req, res) => {
  if (req.params.id) {
    const uri = cipher.decrypt(base64url.decode(req.params.id));
    console.log(uri);
    const textEntities = await detectText(uri);
    const text = removeDomainNames(textEntities.length ? textEntities[0].description! : '');
    const relevantText = textEntities.filter((e, i) => i > 0 && e.description!.indexOf('.com') < 0);
    const [translationByEntity, translation, webEntities, landmarks] = await Promise.all([
      Promise.all(relevantText.map(async e => await translateText(e.description!))),
      translateText(text),
      detectWebEntities(uri),
      detectLandmarks(uri),
    ]);
    await updateImage(toHash(uri), uri, relevantText, translationByEntity);
    res.json({
      translation,
      original: text,
      webEntities,
      landmarks,
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
