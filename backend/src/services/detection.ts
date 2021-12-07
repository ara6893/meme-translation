import { v2 } from '@google-cloud/translate';
const translate = new v2.Translate();

export async function translateText(text: string) {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translation] = await translate.translate(text, 'en');
  return translation;
}
