import { v2 } from '@google-cloud/translate';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { google } from '@google-cloud/vision/build/protos/protos';

const translate = new v2.Translate();

/**
 *
 * @param imageUrl `gs://${bucketName}/${fileName}`
 */
export async function detectText(
  imageUrl: string
): Promise<google.cloud.vision.v1.IEntityAnnotation[]> {
  // Creates a client
  const client = new ImageAnnotatorClient();

  // Performs text detection on the gcs file
  const [result] = await client.textDetection(imageUrl);
  const detections = result.textAnnotations;
  if (detections && detections.length) {
    return detections;
  }
  return [];
}

/**
 *
 * @param imageUrl `gs://${bucketName}/${fileName}`
 */
export async function detectWebEntities(
  imageUrl: string
): Promise<google.cloud.vision.v1.IWebDetection> {
  // Creates a client
  const client = new ImageAnnotatorClient();

  // Performs text detection on the gcs file
  const [result] = await client.webDetection(imageUrl);
  return result.webDetection!;
}

/**
 *
 * @param imageUrl `gs://${bucketName}/${fileName}`
 */
export async function detectLandmarks(imageUrl: string): Promise<string[]> {
  // Creates a client
  const client = new ImageAnnotatorClient();

  // Performs text detection on the gcs file
  const [result] = await client.landmarkDetection(imageUrl);
  return result.landmarkAnnotations!.map(e => e.description!);
}

export async function translateText(text: string) {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translation] = await translate.translate(text, 'en');
  return translation;
}
