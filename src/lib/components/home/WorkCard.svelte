<script lang="ts">
  import type { Work } from "$lib/types";

  import WorkImage from "./WorkImage.svelte";

  let { work }: { work: Work } = $props();

  function displayYear(date: string): string {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? date : String(parsed.getFullYear());
  }
</script>

<article class="work-entry">
  <WorkImage
    layout={work.layout}
    imageUrl={work.cover_image_url}
    workName={work.work_name}
  />

  <div class="work-info">
    <h3>{work.work_name}</h3>
    <p class="work-meta">
      {displayYear(work.created_date)} · {work.real_size || "-"} · {work.materials}
    </p>
    <p class="work-description">{work.description || "作品描述"}</p>
  </div>
</article>

<style>
  .work-entry {
    width: min(100%, 640px);
    margin: 0 auto;
  }

  .work-info {
    margin-top: 1.25rem;
  }

  .work-info h3 {
    margin: 0;
    font-size: clamp(1.8rem, 3vw, 2.3rem);
    font-weight: 500;
  }

  .work-meta,
  .work-description {
    margin: 0.65rem 0 0;
    color: #111111;
    font-size: clamp(1.3rem, 2vw, 1.75rem);
    line-height: 1.38;
  }
</style>
