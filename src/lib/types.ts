export type WorkLayout = "直" | "橫";

export interface Work {
  work_name: string;
  created_date: string;
  materials: string;
  real_size: string;
  digital_size: string;
  description: string;
  layout: WorkLayout;
  cover_image_url: string;
}

export interface Photo {
  file_name: string;
  uploaded_at: string;
}
