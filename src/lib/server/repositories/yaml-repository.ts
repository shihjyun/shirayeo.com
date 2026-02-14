import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { parse, stringify } from "yaml";

const DATA_DIR = resolve(process.cwd(), "data");

function toAbsolutePath(relativePath: string): string {
  return resolve(DATA_DIR, relativePath);
}

export async function readYamlArray<T>(relativePath: string): Promise<T[]> {
  const absolutePath = toAbsolutePath(relativePath);

  try {
    const raw = await readFile(absolutePath, "utf-8");
    const parsed = parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function writeYamlArray<T>(
  relativePath: string,
  rows: T[],
): Promise<void> {
  const absolutePath = toAbsolutePath(relativePath);
  await mkdir(dirname(absolutePath), { recursive: true });

  const yaml = stringify(rows, {
    indent: 2,
    lineWidth: 0,
  });

  await writeFile(absolutePath, yaml, "utf-8");
}
