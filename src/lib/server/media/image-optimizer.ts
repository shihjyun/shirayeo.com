import sharp from "sharp";

const TARGET_BYTES = 800 * 1024;
const INITIAL_QUALITY = 82;
const MIN_QUALITY = 45;
const SCALE_STEP = 0.9;
const MIN_DIMENSION = 720;

type OptimizedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  contentType: string;
  outputName: string;
};

function toJpegName(name: string): string {
  const base = name.replace(/\.[^/.]+$/, "") || "image";
  return `${base}.jpg`;
}

export async function optimizeImageForUpload(
  file: File,
): Promise<OptimizedImage> {
  const input = Buffer.from(await file.arrayBuffer());

  const metadata = await sharp(input, { failOn: "warning" }).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Uploaded file is not a valid image");
  }

  let targetWidth = metadata.width;
  let targetHeight = metadata.height;
  let quality = INITIAL_QUALITY;

  let bestBuffer: Buffer | null = null;
  let bestWidth = targetWidth;
  let bestHeight = targetHeight;

  for (let attempt = 0; attempt < 14; attempt += 1) {
    const { data, info } = await sharp(input)
      .rotate()
      .resize({
        width: Math.max(1, Math.round(targetWidth)),
        height: Math.max(1, Math.round(targetHeight)),
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    if (!bestBuffer || data.length < bestBuffer.length) {
      bestBuffer = data;
      bestWidth = info.width;
      bestHeight = info.height;
    }

    if (data.length <= TARGET_BYTES) {
      return {
        buffer: data,
        width: info.width,
        height: info.height,
        contentType: "image/jpeg",
        outputName: toJpegName(file.name),
      };
    }

    if (quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - 7);
      continue;
    }

    if (Math.min(targetWidth, targetHeight) <= MIN_DIMENSION) {
      break;
    }

    targetWidth *= SCALE_STEP;
    targetHeight *= SCALE_STEP;
    quality = INITIAL_QUALITY;
  }

  if (!bestBuffer) {
    throw new Error("Unable to optimize image");
  }

  return {
    buffer: bestBuffer,
    width: bestWidth,
    height: bestHeight,
    contentType: "image/jpeg",
    outputName: toJpegName(file.name),
  };
}
