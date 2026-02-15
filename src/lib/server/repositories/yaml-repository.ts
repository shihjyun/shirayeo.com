import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { parse, stringify } from "yaml";
import photosYamlRaw from "../../../../data/photos.yaml?raw";
import profileYamlRaw from "../../../../data/profile.yaml?raw";
import worksYamlRaw from "../../../../data/works.yaml?raw";

const DATA_DIR = resolve(process.cwd(), "data");
const BUNDLED_YAML_BY_PATH: Record<string, string> = {
  "photos.yaml": photosYamlRaw,
  "profile.yaml": profileYamlRaw,
  "works.yaml": worksYamlRaw,
};

function toAbsolutePath(relativePath: string): string {
  return resolve(DATA_DIR, relativePath);
}

function readBundledYaml(relativePath: string): unknown {
  const raw = BUNDLED_YAML_BY_PATH[relativePath];
  if (!raw) return undefined;
  return parse(raw);
}

export async function readYamlArray<T>(relativePath: string): Promise<T[]> {
  const absolutePath = toAbsolutePath(relativePath);

  try {
    const raw = await readFile(absolutePath, "utf-8");
    const parsed = parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      const bundled = readBundledYaml(relativePath);
      return Array.isArray(bundled) ? (bundled as T[]) : [];
    }
    throw error;
  }
}

export async function readYamlObject<T>(
  relativePath: string,
  fallback: T,
): Promise<T> {
  const absolutePath = toAbsolutePath(relativePath);

  try {
    const raw = await readFile(absolutePath, "utf-8");
    const parsed = parse(raw);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as T;
    }
    return fallback;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      const bundled = readBundledYaml(relativePath);
      if (
        typeof bundled === "object" &&
        bundled !== null &&
        !Array.isArray(bundled)
      ) {
        return bundled as T;
      }
      return fallback;
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

export async function writeYamlObject<T>(
  relativePath: string,
  value: T,
): Promise<void> {
  const absolutePath = toAbsolutePath(relativePath);
  await mkdir(dirname(absolutePath), { recursive: true });

  const yaml = stringify(value, {
    indent: 2,
    lineWidth: 0,
  });

  await writeFile(absolutePath, yaml, "utf-8");
}
