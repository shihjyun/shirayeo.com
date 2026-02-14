const TARGET_BYTES = 800 * 1024;
const INITIAL_QUALITY = 0.88;
const MIN_QUALITY = 0.5;
const SCALE_STEP = 0.9;
const MIN_DIMENSION = 720;
const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "bmp",
  "avif",
  "heic",
  "heif",
]);

type CompressionResult = {
  file: File;
  width: number;
  height: number;
};

type ImageValidationResult = {
  valid: boolean;
  reason?: string;
};

function getFileExtension(name: string): string {
  const ext = name.split(".").pop();
  return ext ? ext.toLowerCase() : "";
}

function matchesKnownImageSignature(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;

  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const isGif =
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38;
  const isWebp =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;
  const isBmp = bytes[0] === 0x42 && bytes[1] === 0x4d;
  const isHeifFamily =
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70;

  return isJpeg || isPng || isGif || isWebp || isBmp || isHeifFamily;
}

export async function validateImageFile(
  file: File,
): Promise<ImageValidationResult> {
  const mimeLooksImage = file.type.startsWith("image/");
  const ext = getFileExtension(file.name);
  const extensionAllowed = ALLOWED_EXTENSIONS.has(ext);

  if (!mimeLooksImage && !extensionAllowed) {
    return {
      valid: false,
      reason: `${file.name} 不是可接受的圖片格式`,
    };
  }

  try {
    const headerBuffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(headerBuffer);

    if (!matchesKnownImageSignature(bytes)) {
      return {
        valid: false,
        reason: `${file.name} 檔案內容看起來不是圖片`,
      };
    }
  } catch {
    return {
      valid: false,
      reason: `無法讀取 ${file.name}`,
    };
  }

  return { valid: true };
}

async function fileToImageBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

function toJpegName(name: string): string {
  const base = name.replace(/\.[^/.]+$/, "") || "image";
  return `${base}.jpg`;
}

async function canvasToJpegBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

function drawToCanvas(
  bitmap: ImageBitmap,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to get 2D canvas context");
  }

  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function compressImageForUpload(
  file: File,
): Promise<CompressionResult> {
  if (!file.type.startsWith("image/")) {
    return {
      file,
      width: 0,
      height: 0,
    };
  }

  const bitmap = await fileToImageBitmap(file);

  try {
    let width = bitmap.width;
    let height = bitmap.height;
    let quality = INITIAL_QUALITY;

    let bestBlob: Blob | null = null;
    let bestWidth = width;
    let bestHeight = height;

    for (let attempt = 0; attempt < 14; attempt += 1) {
      const canvas = drawToCanvas(bitmap, width, height);
      const blob = await canvasToJpegBlob(canvas, quality);

      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob;
        bestWidth = canvas.width;
        bestHeight = canvas.height;
      }

      if (blob.size <= TARGET_BYTES) {
        return {
          file: new File([blob], toJpegName(file.name), {
            type: "image/jpeg",
            lastModified: Date.now(),
          }),
          width: canvas.width,
          height: canvas.height,
        };
      }

      if (quality > MIN_QUALITY) {
        quality = Math.max(MIN_QUALITY, quality - 0.08);
        continue;
      }

      if (Math.min(width, height) <= MIN_DIMENSION) {
        break;
      }

      width *= SCALE_STEP;
      height *= SCALE_STEP;
      quality = INITIAL_QUALITY;
    }

    if (!bestBlob) {
      return {
        file,
        width: bitmap.width,
        height: bitmap.height,
      };
    }

    return {
      file: new File([bestBlob], toJpegName(file.name), {
        type: "image/jpeg",
        lastModified: Date.now(),
      }),
      width: bestWidth,
      height: bestHeight,
    };
  } finally {
    bitmap.close();
  }
}
