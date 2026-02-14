import type { LayoutServerLoad } from "./$types";

import { assertLocalRequest } from "$lib/server/admin-auth";

export const load = (({ url }) => {
  assertLocalRequest(url);
}) satisfies LayoutServerLoad;
