<script lang="ts">
  import HomeIntro from "$lib/components/home/HomeIntro.svelte";
  import PhotoViewer from "$lib/components/home/PhotoViewer.svelte";
  import WorksSection from "$lib/components/home/WorksSection.svelte";
  import type { PageData } from "./$types";

  interface ViewerPhoto {
    file_name: string;
    uploaded_at: string;
    url: string;
  }

  let { data }: { data: PageData } = $props();

  const works = $derived(
    [...data.works].sort(
      (a, b) => Date.parse(b.created_date) - Date.parse(a.created_date),
    ),
  );
  const photos = $derived(
    data.photos.filter(
      (photo): photo is ViewerPhoto =>
        typeof photo.file_name === "string" &&
        typeof photo.url === "string" &&
        photo.url.length > 0,
    ),
  );
  let viewerPhotos = $state<ViewerPhoto[]>([]);
  let isPhotoViewerOpen = $state(false);

  function shufflePhotos(list: ViewerPhoto[]): ViewerPhoto[] {
    const shuffled = [...list];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    return shuffled;
  }

  function openPhotoViewer(): void {
    viewerPhotos = shufflePhotos(photos);
    isPhotoViewerOpen = true;
  }

  function closePhotoViewer(): void {
    isPhotoViewerOpen = false;
  }

  const pageTitle = "Shirayeo Portfolio | Drawing Works";
  const pageDescription =
    "Shirayeo 的手繪與複合媒材作品集，收錄畫作資訊與照片紀錄。";
  const ogImage = "/favicon.svg";
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={ogImage} />
</svelte:head>

<main class="page-shell">
  <HomeIntro intro={data.profile.intro} onOpenPhotos={openPhotoViewer} />
  <WorksSection {works} />
</main>

{#if isPhotoViewerOpen}
  <PhotoViewer photos={viewerPhotos} onClose={closePhotoViewer} />
{/if}

<style>
  .page-shell {
    margin: 3.4rem auto 4.4rem;
    max-width: 860px;
    padding: 0 1.5rem;
  }

  @media (max-width: 700px) {
    .page-shell {
      margin: 1.9rem auto 3.2rem;
      padding: 0 1.1rem;
    }
  }
</style>
