import { env } from "$env/dynamic/private";

import type { MediaProvider } from "./media-provider";
import { GcsMediaProvider } from "./providers/gcs";
import { GcsStubMediaProvider } from "./providers/gcs.stub";

function createMediaProvider(): MediaProvider {
  const mode = env.MEDIA_PROVIDER?.trim().toLowerCase() ?? "stub";

  switch (mode) {
    case "stub":
      return new GcsStubMediaProvider();
    case "gcs":
      return new GcsMediaProvider();
    default:
      throw new Error(
        `Unsupported MEDIA_PROVIDER: ${mode}. Use "stub" or "gcs".`,
      );
  }
}

const mediaProvider: MediaProvider = createMediaProvider();

export function getMediaProvider(): MediaProvider {
  return mediaProvider;
}
