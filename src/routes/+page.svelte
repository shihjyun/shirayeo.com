<script lang="ts">
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

  function displayYear(date: string): string {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? date : String(parsed.getFullYear());
  }
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
  <section class="intro-block">
    <h1 class="intro-title"><span>shirayeo</span></h1>
    <p class="intro-copy">
      楊時瑞，2008年生於臺灣。主要以素描與水彩作為創作媒材，透過觀察日常與自身經驗，探索時間、記憶與情感在畫面中的痕跡。創作之外，也以攝影記錄生活片段，成為視覺靈感的重要來源。
    </p>
  </section>

  <section class="works-section">
    <h2 class="works-title">作品</h2>
    <ul class="works-list">
      {#each works as work}
        <li class="work-entry">
          <div
            class={`work-image ${work.layout === "橫" ? "is-landscape" : "is-portrait"}`}
          >
            {#if work.cover_image_url}
              <img
                src={work.cover_image_url}
                alt={work.work_name}
                loading="lazy"
              />
            {:else}
              <div class="work-image-placeholder" aria-hidden="true"></div>
            {/if}
          </div>

          <div class="work-info">
            <h3>{work.work_name}</h3>
            <p class="work-meta">
              {displayYear(work.created_date)} · {work.real_size || "-"} · {work.materials}
            </p>
            <p class="work-description">{work.description || "作品描述"}</p>
          </div>
        </li>
      {/each}
    </ul>
  </section>
</main>
