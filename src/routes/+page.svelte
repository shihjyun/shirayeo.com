<script lang="ts">
  import HomeIntro from "$lib/components/home/HomeIntro.svelte";
  import WorksSection from "$lib/components/home/WorksSection.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const works = $derived(
    [...data.works].sort(
      (a, b) => Date.parse(b.created_date) - Date.parse(a.created_date),
    ),
  );

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
  <HomeIntro intro={data.profile.intro} />
  <WorksSection {works} />
</main>

<style>
  .page-shell {
    margin: 4.5rem auto 5rem;
    max-width: 820px;
    padding: 0 1.5rem;
  }

  @media (max-width: 700px) {
    .page-shell {
      margin: 2.2rem auto 3.8rem;
      padding: 0 1.1rem;
    }
  }
</style>
