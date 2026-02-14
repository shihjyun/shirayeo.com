export type MediaKind = "photos" | "works";

export interface UploadedMedia {
  fileName: string;
  url: string;
  width: number;
  height: number;
}

export interface MediaProvider {
  upload(args: { kind: MediaKind; file: File }): Promise<UploadedMedia>;
  publicUrl(kind: MediaKind, fileName: string): string;
}
