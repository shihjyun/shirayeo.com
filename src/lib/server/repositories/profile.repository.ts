import type { ArtistProfile } from "$lib/types";

import { readYamlObject, writeYamlObject } from "./yaml-repository";

const PROFILE_FILE = "profile.yaml";

const DEFAULT_PROFILE: ArtistProfile = {
  intro:
    "楊時瑞，2008年生於臺灣。主要以素描與水彩作為創作媒材，透過觀察日常與自身經驗，探索時間、記憶與情感在畫面中的痕跡。創作之外，也以攝影記錄生活片段，成為視覺靈感的重要來源。",
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeProfile(row: unknown): ArtistProfile {
  const raw =
    typeof row === "object" && row !== null
      ? (row as Record<string, unknown>)
      : {};

  const intro = asString(raw.intro);
  return {
    intro: intro.length > 0 ? intro : DEFAULT_PROFILE.intro,
  };
}

export async function getProfile(): Promise<ArtistProfile> {
  const row = await readYamlObject<unknown>(PROFILE_FILE, DEFAULT_PROFILE);
  return normalizeProfile(row);
}

export async function saveProfile(profile: ArtistProfile): Promise<void> {
  await writeYamlObject(PROFILE_FILE, profile);
}
