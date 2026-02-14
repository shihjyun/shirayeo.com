import type { MediaProvider } from "./media-provider";
import { GcsStubMediaProvider } from "./providers/gcs.stub";

const mediaProvider: MediaProvider = new GcsStubMediaProvider();

export function getMediaProvider(): MediaProvider {
  return mediaProvider;
}
