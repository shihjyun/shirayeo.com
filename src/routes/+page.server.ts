import type { PageServerLoad } from "./$types";

import { getMediaProvider } from "$lib/server/media";
import { getPhotos } from "$lib/server/repositories/photos.repository";
import { getProfile } from "$lib/server/repositories/profile.repository";
import { getWorks } from "$lib/server/repositories/works.repository";

export const load = (async () => {
  const [works, photos, profile] = await Promise.all([
    getWorks(),
    getPhotos(),
    getProfile(),
  ]);
  const mediaProvider = getMediaProvider();

  return {
    works,
    photos: photos.map((photo) => ({
      ...photo,
      url: mediaProvider.publicUrl("photos", photo.file_name),
    })),
    profile,
  };
}) satisfies PageServerLoad;
