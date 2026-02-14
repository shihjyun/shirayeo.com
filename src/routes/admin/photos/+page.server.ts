import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { assertLocalRequest } from "$lib/server/admin-auth";
import { getMediaProvider } from "$lib/server/media";
import {
  getPhotos,
  savePhotos,
} from "$lib/server/repositories/photos.repository";

function toIndex(value: FormDataEntryValue | null): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return null;
  return parsed;
}

export const load = (async ({ url }) => {
  assertLocalRequest(url);

  const mediaProvider = getMediaProvider();
  const photos = await getPhotos();
  return {
    photos: photos.map((photo) => ({
      ...photo,
      url: mediaProvider.publicUrl("photos", photo.file_name),
    })),
  };
}) satisfies PageServerLoad;

export const actions = {
  uploadPhotos: async ({ request, url }) => {
    assertLocalRequest(url);

    const formData = await request.formData();
    const files = formData.getAll("photos");

    const selectedFiles = files
      .filter((entry): entry is File => entry instanceof File)
      .filter((file) => file.size > 0);

    if (selectedFiles.length === 0) {
      return fail(400, { message: "No files selected." });
    }

    const mediaProvider = getMediaProvider();
    const uploaded = await Promise.all(
      selectedFiles.map((file) =>
        mediaProvider.upload({ kind: "photos", file }),
      ),
    );

    const now = new Date().toISOString();
    const photos = await getPhotos();
    photos.push(
      ...uploaded.map((item) => ({
        file_name: item.fileName,
        uploaded_at: now,
      })),
    );
    await savePhotos(photos);

    redirect(303, "/admin/photos");
  },

  deletePhoto: async ({ request, url }) => {
    assertLocalRequest(url);

    const formData = await request.formData();
    const index = toIndex(formData.get("index"));
    if (index === null) return fail(400, { message: "Invalid photo index." });

    const photos = await getPhotos();
    if (!photos[index]) return fail(404, { message: "Photo not found." });

    photos.splice(index, 1);
    await savePhotos(photos);

    redirect(303, "/admin/photos");
  },
} satisfies Actions;
