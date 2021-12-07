// The ID of your GCS bucket
const bucketName = 'your-unique-bucket-name';

// The path to your file to upload
// const filePath = 'path/to/your/file';

// The new ID for your GCS file
// const destFileName = 'your-new-file-name';

// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage';

// Creates a client
const storage = new Storage();

async function uploadFile(filePath: string, destFileName: string) {
  await storage.bucket(bucketName).upload(filePath, {
    destination: destFileName,
  });

  console.log(`${filePath} uploaded to ${bucketName}`);
}
