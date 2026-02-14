export type MediaKind = "photos" | "works";

export interface UploadedMedia {
  fileName: string;
  url: string;
}

export interface MediaProvider {
  upload(args: { kind: MediaKind; file: File }): Promise<UploadedMedia>;
  publicUrl(kind: MediaKind, fileName: string): string;
}
