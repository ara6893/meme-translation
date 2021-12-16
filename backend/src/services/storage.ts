// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage';
import { PassThrough } from 'stream';
import { v4 as uuidv4 } from 'uuid';

// Creates a client
const storage = new Storage();

const BUCKET_NAME = 'rsss415-asennyey';

const bucket = storage.bucket(BUCKET_NAME);

function getFileName(gsUri: string) {
  return gsUri.slice(gsUri.lastIndexOf('/') + 1);
}

export async function downloadFile(uri: string): Promise<Buffer> {
  let [response] = await bucket.file(getFileName(uri)).download({});
  // Downloads the file
  return response;
}

export async function uploadFile(file: Express.Multer.File): Promise<string> {
  const fileName = `${uuidv4()}.${file.originalname.substring(
    file.originalname.lastIndexOf('.') + 1
  )}`;
  const gcsFile = bucket.file(fileName);
  const passthroughStream = new PassThrough();
  passthroughStream.write(file.buffer);
  passthroughStream.end();

  return new Promise((res, rej) => {
    passthroughStream.pipe(gcsFile.createWriteStream()).on('finish', () => {
      // The file upload is complete
      res(`gs://${BUCKET_NAME}/${fileName}`);
    });
  });
}
