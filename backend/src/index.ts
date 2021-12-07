import express from 'express';
import multer from 'multer';
import cors from 'cors';
import MulterGoogleCloudStorage from 'multer-cloud-storage';
import { detectText } from './services/textDetection';
import { config } from 'dotenv';
import morgan from 'morgan';
import { translateText } from './services/detection';
config();

const app = express();

app.use(cors());
app.use(morgan('tiny'));

// Create multer object
const imageUpload = multer({
  storage: new MulterGoogleCloudStorage({
    uniformBucketLevelAccess: true,
  }),
});

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/parse/image', imageUpload.single('image'), async (req, res) => {
  if (req.file) {
    const text = await detectText((req.file as any).uri);
    res.json({
      translation: await translateText(text),
      original: text,
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
