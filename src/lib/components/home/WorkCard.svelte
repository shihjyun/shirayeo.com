<script lang="ts">
  import { onMount } from "svelte";
  import type { Work } from "$lib/types";

  import WorkImage from "./WorkImage.svelte";

  let { work }: { work: Work } = $props();
  const description = $derived(work.description.trim());
  let cardElement = $state<HTMLElement | null>(null);
  let isVisible = $state(false);

  function displayYear(date: string): string {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? date : String(parsed.getFullYear());
  }

  onMount(() => {
    if (!cardElement) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      isVisible = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(cardElement);

    return () => observer.disconnect();
  });
</script>

<article
  bind:this={cardElement}
  class={`work-entry ${work.layout === "直" ? "is-portrait" : "is-landscape"} ${
    isVisible ? "is-visible" : ""
  }`}
>
  <WorkImage
    layout={work.layout}
    imageUrl={work.cover_image_url}
    workName={work.work_name}
    digitalSize={work.digital_size}
  />

  <div class="work-info">
    <h3>{work.work_name}</h3>
    <p class="work-meta">
      {displayYear(work.created_date)} · {work.real_size || "-"} · {work.materials}
    </p>
    {#if description}
      <p class="work-description">{description}</p>
    {/if}
  </div>
</article>

<style>
  .work-entry {
    width: min(100%, 720px);
    margin: 0 auto;
    opacity: 0;
    transform: translateY(22px);
    transition:
      opacity 540ms ease,
      transform 540ms ease;
    will-change: opacity, transform;
  }

  .work-entry.is-visible {
    opacity: 1;
    transform: translateY(0);
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

  .work-entry.is-portrait .work-info {
    width: min(70%, 430px);
    margin: 0.95rem auto 0;
  }

  @media (max-width: 700px) {
    .work-entry.is-portrait .work-info {
      width: min(82%, 340px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .work-entry {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
