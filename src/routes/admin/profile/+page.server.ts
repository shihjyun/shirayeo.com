import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { assertLocalRequest } from "$lib/server/admin-auth";
import {
  getProfile,
  saveProfile,
} from "$lib/server/repositories/profile.repository";

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export const load = (async ({ url }) => {
  assertLocalRequest(url);

  const profile = await getProfile();
  return { profile };
}) satisfies PageServerLoad;

export const actions = {
  updateProfile: async ({ request, url }) => {
    assertLocalRequest(url);

    const formData = await request.formData();
    const intro = asString(formData.get("intro"));

    if (intro.length === 0) {
      return fail(400, { message: "自我介紹不能為空。" });
    }

    await saveProfile({ intro });
    return { message: "自我介紹已更新。" };
  },
} satisfies Actions;
