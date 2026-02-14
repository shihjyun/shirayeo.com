import { env } from "$env/dynamic/private";

import type { MediaProvider } from "./media-provider";
import { GcsStubMediaProvider } from "./providers/gcs.stub";

function createMediaProvider(): MediaProvider {
  const mode = env.MEDIA_PROVIDER?.trim().toLowerCase() ?? "stub";

  switch (mode) {
    case "stub":
      return new GcsStubMediaProvider();
    case "gcs":
      // TODO: Replace with real GCS provider implementation in future phase.
      return new GcsStubMediaProvider();
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
