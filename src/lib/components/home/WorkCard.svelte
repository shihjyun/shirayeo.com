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
    width: min(100%, 680px);
    margin: 0 auto;
  }

  .work-info {
    margin-top: 0.95rem;
  }

  .work-info h3 {
    margin: 0;
    font-size: clamp(1.28rem, 1.8vw, 1.7rem);
    font-weight: 540;
    line-height: 1.3;
  }

  .work-meta {
    margin: 0.35rem 0 0;
    color: #4f6066;
    font-size: clamp(0.88rem, 1.02vw, 0.96rem);
    line-height: 1.55;
    letter-spacing: 0.01em;
  }

  .work-description {
    margin: 0.52rem 0 0;
    color: #1f2a2d;
    font-size: clamp(0.98rem, 1.2vw, 1.08rem);
    line-height: 1.75;
  }
</style>
