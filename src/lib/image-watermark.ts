// src/lib/image-watermark.ts
// Downloads a DALL-E URL, adds farjadp.info watermark using Sharp, saves to GCS
import sharp from "sharp";
import { Storage } from "@google-cloud/storage";

const WATERMARK_TEXT = "farjadp.info";
const storage = new Storage();
const BUCKET_NAME = "officialwebsite-media-bucket";

function buildWatermarkSvg(w: number, h: number): Buffer {
  const fontSize = Math.max(14, Math.round(w * 0.018));
  const padding = Math.round(fontSize * 0.8);
  const textW = WATERMARK_TEXT.length * fontSize * 0.58;
  const textH = fontSize;
  const bgW = Math.round(textW + padding * 2);
  const bgH = Math.round(textH + padding);
  const x = w - bgW - 14;
  const y = h - bgH - 14;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect x="${x}" y="${y}" width="${bgW}" height="${bgH}" rx="5" ry="5"
    fill="black" fill-opacity="0.55"/>
  <text
    x="${x + padding}" y="${y + textH - Math.round(padding * 0.15)}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${fontSize}"
    font-weight="bold"
    fill="white"
    fill-opacity="0.92"
    letter-spacing="0.5"
  >${WATERMARK_TEXT}</text>
</svg>`.trim();

  return Buffer.from(svg);
}

export async function downloadAndWatermark(
  dalleUrl: string,
  filename: string
): Promise<string> {
  // 1. Fetch from DALL-E (URL expires in ~1h so we save immediately)
  const response = await fetch(dalleUrl);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
  const arrayBuffer = await response.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  // 2. Get image dimensions
  const meta = await sharp(inputBuffer).metadata();
  const w = meta.width ?? 1792;
  const h = meta.height ?? 1024;

  // 3. Composite the SVG watermark on top
  const watermarkSvg = buildWatermarkSvg(w, h);
  const outputBuffer = await sharp(inputBuffer)
    .composite([{ input: watermarkSvg, blend: "over" }])
    .jpeg({ quality: 90 })
    .toBuffer();

  // 4. Save to Google Cloud Storage
  const bucket = storage.bucket(BUCKET_NAME);
  const gcsFile = bucket.file(`generated/${filename}`);

  await gcsFile.save(outputBuffer, {
    contentType: "image/jpeg",
    resumable: false,
  });

  return `https://storage.googleapis.com/${BUCKET_NAME}/generated/${filename}`;
}
