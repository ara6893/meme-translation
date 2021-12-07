import { ImageAnnotatorClient } from '@google-cloud/vision';

/**
 *
 * @param imageUrl `gs://${bucketName}/${fileName}`
 */
export async function detectText(imageUrl: string): Promise<string> {
  // Creates a client
  const client = new ImageAnnotatorClient();

  // Performs text detection on the gcs file
  const [result] = await client.textDetection(imageUrl);
  const detections = result.textAnnotations;
  if (detections && detections.length) {
    return detections[0].description || '';
  }
  return '';
}
