function hasHeicExtension(name: string): boolean {
  return /\.(heic|heif)$/i.test(name);
}

export function isHeicLike(file: File): boolean {
  const mime = (file.type || "").toLowerCase();
  return (
    mime.includes("heic") ||
    mime.includes("heif") ||
    hasHeicExtension(file.name)
  );
}

function toJpegName(name: string): string {
  const base = name.replace(/\.[^/.]+$/, "") || "image";
  return `${base}.jpg`;
}

export async function normalizeImageForUpload(file: File): Promise<File> {
  if (!isHeicLike(file)) {
    return file;
  }

  if (typeof window === "undefined") {
    return file;
  }

  const module = await import("heic2any");
  const heic2any = module.default;

  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });

  const blob = Array.isArray(converted) ? converted[0] : converted;

  return new File([blob], toJpegName(file.name), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}
