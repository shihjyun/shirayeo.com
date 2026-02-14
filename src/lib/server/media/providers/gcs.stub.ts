import { env } from "$env/dynamic/private";

import type {
  MediaKind,
  MediaProvider,
  UploadedMedia,
} from "../media-provider";

const DEFAULT_BASE_URL = "https://img.shihjyunyeo.com/shirayeo";

function sanitizeName(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function buildBaseUrl(kind: MediaKind): string {
  const custom =
    kind === "photos"
      ? env.MEDIA_PHOTOS_BASE_URL?.trim()
      : env.MEDIA_WORKS_BASE_URL?.trim();

  if (custom) {
    return custom.replace(/\/$/, "");
  }

  return `${DEFAULT_BASE_URL}/${kind}`;
}

function normalizeFileName(fileName: string): string {
  const sanitized = sanitizeName(fileName || "file");
  return `${Date.now()}-${sanitized}`;
}

export class GcsStubMediaProvider implements MediaProvider {
  publicUrl(kind: MediaKind, fileName: string): string {
    if (/^https?:\/\//i.test(fileName)) {
      return fileName;
    }

    return `${buildBaseUrl(kind)}/${fileName}`;
  }

  async upload(args: { kind: MediaKind; file: File }): Promise<UploadedMedia> {
    const fileName = normalizeFileName(args.file.name);

    return {
      fileName,
      url: this.publicUrl(args.kind, fileName),
      width: 0,
      height: 0,
    };
  }
}
