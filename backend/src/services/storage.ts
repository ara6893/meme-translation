// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage';
import { PassThrough } from 'stream';

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
  const gcsFile = bucket.file(file.originalname);
  const passthroughStream = new PassThrough();
  passthroughStream.write(file.buffer);
  passthroughStream.end();

  return new Promise((res, rej) => {
    passthroughStream.pipe(gcsFile.createWriteStream()).on('finish', () => {
      // The file upload is complete
      console.log(gcsFile.baseUrl!);
      res(`gs://${BUCKET_NAME}/${gcsFile.name}`);
    });
  });
}
