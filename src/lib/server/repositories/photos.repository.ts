import type { Photo } from "$lib/types";

import { readYamlArray, writeYamlArray } from "./yaml-repository";

const PHOTOS_FILE = "photos.yaml";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizePhoto(row: unknown): Photo {
  const raw =
    typeof row === "object" && row !== null
      ? (row as Record<string, unknown>)
      : {};

  return {
    file_name: asString(raw.file_name),
    uploaded_at: asString(raw.uploaded_at),
  };
}

export async function getPhotos(): Promise<Photo[]> {
  const rows = await readYamlArray<unknown>(PHOTOS_FILE);
  return rows.map((row) => normalizePhoto(row));
}

export async function savePhotos(photos: Photo[]): Promise<void> {
  await writeYamlArray(PHOTOS_FILE, photos);
}
