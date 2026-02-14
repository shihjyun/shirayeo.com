import { Storage } from "@google-cloud/storage";
import { env } from "$env/dynamic/private";

import { optimizeImageForUpload } from "../image-optimizer";
import type {
  MediaKind,
  MediaProvider,
  UploadedMedia,
} from "../media-provider";

function required(name: string, value: string | undefined): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return normalized;
}

function sanitizeName(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function normalizeFileName(fileName: string): string {
  const sanitized = sanitizeName(fileName || "file");
  return `${Date.now()}-${sanitized}`;
}

function toPrivateKey(raw: string): string {
  return raw.replace(/\\n/g, "\n");
}

export class GcsMediaProvider implements MediaProvider {
  private storage: Storage;
  private bucketName: string;
  private objectPrefix: string;
  private photosBaseUrl: string;
  private worksBaseUrl: string;

  constructor() {
    const projectId = required("GCS_PROJECT_ID", env.GCS_PROJECT_ID);
    const clientEmail = required("GCS_CLIENT_EMAIL", env.GCS_CLIENT_EMAIL);
    const privateKeyRaw = required("GCS_PRIVATE_KEY", env.GCS_PRIVATE_KEY);
    this.bucketName = required("GCS_BUCKET_NAME", env.GCS_BUCKET_NAME);
    this.objectPrefix = (env.GCS_OBJECT_PREFIX || "")
      .trim()
      .replace(/^\/+|\/+$/g, "");

    this.photosBaseUrl = (env.MEDIA_PHOTOS_BASE_URL || "")
      .trim()
      .replace(/\/$/, "");
    this.worksBaseUrl = (env.MEDIA_WORKS_BASE_URL || "")
      .trim()
      .replace(/\/$/, "");

    this.storage = new Storage({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: toPrivateKey(privateKeyRaw),
      },
    });
  }

  publicUrl(kind: MediaKind, fileName: string): string {
    if (/^https?:\/\//i.test(fileName)) {
      return fileName;
    }

    const base = kind === "photos" ? this.photosBaseUrl : this.worksBaseUrl;
    if (base) {
      return `${base}/${fileName}`;
    }

    return `https://storage.googleapis.com/${this.bucketName}/${kind}/${fileName}`;
  }

  async upload(args: { kind: MediaKind; file: File }): Promise<UploadedMedia> {
    const optimized = await optimizeImageForUpload(args.file);
    const fileName = normalizeFileName(optimized.outputName);
    const objectPath = this.objectPrefix
      ? `${this.objectPrefix}/${args.kind}/${fileName}`
      : `${args.kind}/${fileName}`;

    const bucket = this.storage.bucket(this.bucketName);
    const object = bucket.file(objectPath);

    await object.save(optimized.buffer, {
      resumable: false,
      contentType: optimized.contentType,
      metadata: {
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    return {
      fileName,
      url: this.publicUrl(args.kind, fileName),
      width: optimized.width,
      height: optimized.height,
    };
  }
}
