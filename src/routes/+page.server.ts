import type { PageServerLoad } from "./$types";

import { getPhotos } from "$lib/server/repositories/photos.repository";
import { getProfile } from "$lib/server/repositories/profile.repository";
import { getWorks } from "$lib/server/repositories/works.repository";

export const load = (async () => {
  const [works, photos, profile] = await Promise.all([
    getWorks(),
    getPhotos(),
    getProfile(),
  ]);

  return {
    works,
    photos,
    profile,
  };
}) satisfies PageServerLoad;
