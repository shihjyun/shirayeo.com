import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { assertLocalRequest } from "$lib/server/admin-auth";
import { getMediaProvider } from "$lib/server/media";
import { getWorks, saveWorks } from "$lib/server/repositories/works.repository";
import type { Work } from "$lib/types";

function toIndex(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return null;
  return parsed;
}

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function toLayout(value: FormDataEntryValue | null): Work["layout"] {
  return value === "橫" ? "橫" : "直";
}

function readWorkFromForm(formData: FormData): Work {
  return {
    work_name: asString(formData.get("work_name")),
    created_date: asString(formData.get("created_date")),
    materials: asString(formData.get("materials")),
    real_size: asString(formData.get("real_size")),
    digital_size: asString(formData.get("digital_size")),
    description: asString(formData.get("description")),
    layout: toLayout(formData.get("layout")),
    cover_image_url: null,
  };
}

function toLongByShort(width: number, height: number): string {
  const longSide = Math.max(width, height);
  const shortSide = Math.min(width, height);
  return `${longSide} x ${shortSide}`;
}

async function resolveCoverImageUpload(
  formData: FormData,
  fallbackUrl: string | null,
): Promise<{ url: string | null; digitalSize: string | null }> {
  const maybeFile = formData.get("cover_image_file");
  if (!(maybeFile instanceof File) || maybeFile.size === 0) {
    return { url: fallbackUrl, digitalSize: null };
  }

  const mediaProvider = getMediaProvider();
  const uploaded = await mediaProvider.upload({
    kind: "works",
    file: maybeFile,
  });
  const digitalSize =
    uploaded.width > 0 && uploaded.height > 0
      ? toLongByShort(uploaded.width, uploaded.height)
      : null;

  return { url: uploaded.url, digitalSize };
}

function isWorkValid(work: Work): boolean {
  return (
    work.work_name.length > 0 &&
    work.created_date.length > 0 &&
    work.materials.length > 0 &&
    work.real_size.length > 0
  );
}

function getLatestWorkIndex(works: Work[]): number {
  if (works.length === 0) return -1;

  let bestIndex = 0;
  let bestTime = Number.NEGATIVE_INFINITY;

  works.forEach((work, index) => {
    const time = Date.parse(work.created_date);
    const normalizedTime = Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
    if (normalizedTime >= bestTime) {
      bestTime = normalizedTime;
      bestIndex = index;
    }
  });

  return bestIndex;
}

export const load = (async ({ url }) => {
  assertLocalRequest(url);

  const works = await getWorks();
  const requestedIndex = toIndex(url.searchParams.get("index"));

  const selectedIndex =
    requestedIndex !== null && works[requestedIndex]
      ? requestedIndex
      : getLatestWorkIndex(works);

  return {
    works,
    selectedIndex,
  };
}) satisfies PageServerLoad;

export const actions = {
  createWork: async ({ request, url }) => {
    assertLocalRequest(url);

    const formData = await request.formData();
    const nextWork = readWorkFromForm(formData);
    try {
      const uploaded = await resolveCoverImageUpload(formData, null);
      nextWork.cover_image_url = uploaded.url;
      if (uploaded.digitalSize) {
        nextWork.digital_size = uploaded.digitalSize;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown upload error";
      return fail(500, { message: `GCS upload failed: ${message}` });
    }

    if (!isWorkValid(nextWork)) {
      return fail(400, { message: "Missing required work fields." });
    }

    const works = await getWorks();
    works.push(nextWork);
    await saveWorks(works);

    redirect(303, `/admin/works?index=${works.length - 1}`);
  },

  updateWork: async ({ request, url }) => {
    assertLocalRequest(url);

    const formData = await request.formData();
    const index = toIndex(asString(formData.get("index")));
    if (index === null) return fail(400, { message: "Invalid work index." });

    const works = await getWorks();
    if (!works[index]) return fail(404, { message: "Work not found." });

    const nextWork = readWorkFromForm(formData);
    try {
      const uploaded = await resolveCoverImageUpload(
        formData,
        works[index].cover_image_url,
      );
      nextWork.cover_image_url = uploaded.url;
      if (uploaded.digitalSize) {
        nextWork.digital_size = uploaded.digitalSize;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown upload error";
      return fail(500, { message: `GCS upload failed: ${message}` });
    }
    if (!isWorkValid(nextWork)) {
      return fail(400, { message: "Missing required work fields." });
    }

    works[index] = nextWork;
    await saveWorks(works);

    redirect(303, `/admin/works?index=${index}`);
  },

  deleteWork: async ({ request, url }) => {
    assertLocalRequest(url);

    const formData = await request.formData();
    const index = toIndex(asString(formData.get("index")));
    if (index === null) return fail(400, { message: "Invalid work index." });

    const works = await getWorks();
    if (!works[index]) return fail(404, { message: "Work not found." });

    works.splice(index, 1);
    await saveWorks(works);

    if (works.length === 0) {
      redirect(303, "/admin/works");
    }

    const nextIndex = Math.max(0, Math.min(index, works.length - 1));
    redirect(303, `/admin/works?index=${nextIndex}`);
  },
} satisfies Actions;
