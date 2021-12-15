// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage';

// Creates a client
const storage = new Storage();

function getBucketName(gsUri: string) {
  const uri = gsUri.replace('gs://', '');
  return uri.slice(0, uri.indexOf('/'));
}

function getFileName(gsUri: string) {
  const uri = gsUri.replace('gs://', '');
  return uri.slice(uri.indexOf('/') + 1);
}

export async function downloadFile(uri: string): Promise<Buffer> {
  const options = {};

  let [response] = await storage
    .bucket(getBucketName(uri))
    .file(getFileName(uri))
    .download(options);

  // Downloads the file
  return response;
}
