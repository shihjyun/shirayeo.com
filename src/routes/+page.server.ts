import type { PageServerLoad } from "./$types";

import { getPhotos } from "$lib/server/repositories/photos.repository";
import { getWorks } from "$lib/server/repositories/works.repository";

export const load = (async () => {
  const [works, photos] = await Promise.all([getWorks(), getPhotos()]);

  return {
    works,
    photos,
  };
}) satisfies PageServerLoad;
