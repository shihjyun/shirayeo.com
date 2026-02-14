import type { Work } from "$lib/types";

import { readYamlArray, writeYamlArray } from "./yaml-repository";

const WORKS_FILE = "works.yaml";

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNullableString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeWork(row: unknown): Work {
  const raw =
    typeof row === "object" && row !== null
      ? (row as Record<string, unknown>)
      : {};
  const layout = raw.layout === "橫" ? "橫" : "直";

  return {
    work_name: asString(raw.work_name),
    created_date: asString(raw.created_date),
    materials: asString(raw.materials),
    real_size: asString(raw.real_size ?? raw.size),
    digital_size: asString(raw.digital_size),
    description: asString(raw.description),
    layout,
    cover_image_url: asNullableString(raw.cover_image_url),
  };
}

export async function getWorks(): Promise<Work[]> {
  const rows = await readYamlArray<unknown>(WORKS_FILE);
  return rows.map((row) => normalizeWork(row));
}

export async function saveWorks(works: Work[]): Promise<void> {
  await writeYamlArray(WORKS_FILE, works);
}
