<script lang="ts">
  import type { WorkLayout } from "$lib/types";

  let {
    layout,
    imageUrl,
    workName,
    digitalSize,
  }: {
    layout: WorkLayout;
    imageUrl: string | null;
    workName: string;
    digitalSize: string;
  } = $props();

  const ratio = $derived(parseDigitalSize(digitalSize));

  function parseDigitalSize(
    size: string,
  ): { width: number; height: number } | null {
    const matched = size.match(/(\d+)\s*[xX]\s*(\d+)/);
    if (!matched) return null;

    const width = Number(matched[1]);
    const height = Number(matched[2]);
    if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
    if (width <= 0 || height <= 0) return null;
    return { width, height };
  }
</script>

<div class={`work-image ${layout === "橫" ? "is-landscape" : "is-portrait"} ${imageUrl ? "has-image" : "no-image"}`}>
  {#if imageUrl}
    <img
      src={imageUrl}
      alt={workName}
      loading="lazy"
      width={ratio?.width}
      height={ratio?.height}
    />
  {:else}
    <div class="work-image-placeholder" aria-hidden="true"></div>
  {/if}
</div>

<style>
  .work-image {
    overflow: hidden;
    background: var(--placeholder);
  }

  .work-image.has-image {
    background: transparent;
  }

  .work-image.no-image.is-landscape {
    aspect-ratio: 16 / 9;
  }

  .work-image.is-portrait {
    width: min(70%, 430px);
    margin: 0 auto;
  }

  .work-image.no-image.is-portrait {
    aspect-ratio: 3 / 4;
  }

  .work-image img,
  .work-image-placeholder {
    width: 100%;
  }

  .work-image img {
    display: block;
    height: auto;
  }

  @media (max-width: 700px) {
    .work-image.is-portrait {
      width: min(82%, 340px);
    }
  }
</style>
