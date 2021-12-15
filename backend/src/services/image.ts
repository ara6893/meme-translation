import { downloadFile } from './storage';
import { Image, createCanvas } from 'node-canvas';
import sizeOf from 'image-size';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { google } from '@google-cloud/vision/build/protos/protos';
import { PUBLIC_FOLDER } from '../env.const';
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function toRect(polygon: google.cloud.vision.v1.IVertex[]): Rect {
  return {
    x: Math.min(...polygon.map(e => e.x!)),
    y: Math.min(...polygon.map(e => e.y!)),
    w: Math.max(...polygon.map(e => e.x!)) - Math.min(...polygon.map(e => e.x!)),
    h: Math.max(...polygon.map(e => e.y!)) - Math.min(...polygon.map(e => e.y!)),
  };
}

export async function updateImage(
  id: string,
  uri: string,
  text: google.cloud.vision.v1.IEntityAnnotation[],
  translation: string[]
) {
  let imageData = await downloadFile(uri);
  let size = sizeOf(imageData);
  console.log(size);
  const canvas = createCanvas(size.width!, size.height!);
  const context = canvas.getContext('2d');
  const img = new Image();
  img.src = imageData;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  context.fillStyle = 'white';
  context.textAlign = 'left';
  context.font = '24px Arial';
  context.textBaseline = 'top'; // change baseline property
  context.beginPath();

  text.forEach((el, i) => {
    const { x, y, w, h } = toRect(el.boundingPoly?.vertices!);
    context.fillStyle = 'white';
    context.fillRect(x, y, w, h);
    context.fillStyle = 'black';
    context.fillText(translation[i], x, y, w);
  });
  context.closePath();
  const buffer = canvas.toBuffer('image/png');
  const dir = path.join(PUBLIC_FOLDER, `/images`);
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  writeFileSync(`${dir}/${id}.png`, buffer);
}
