<script lang="ts">
  import type { WorkLayout } from "$lib/types";

  let {
    layout,
    imageUrl,
    workName,
  }: {
    layout: WorkLayout;
    imageUrl: string | null;
    workName: string;
  } = $props();
</script>

<div class={`work-image ${layout === "橫" ? "is-landscape" : "is-portrait"}`}>
  {#if imageUrl}
    <img src={imageUrl} alt={workName} loading="lazy" />
  {:else}
    <div class="work-image-placeholder" aria-hidden="true"></div>
  {/if}
</div>

<style>
  .work-image {
    overflow: hidden;
    background: var(--placeholder);
  }

  .work-image.is-landscape {
    aspect-ratio: 16 / 9;
  }

  .work-image.is-portrait {
    width: min(70%, 430px);
    margin: 0 auto;
    aspect-ratio: 3 / 4;
  }

  .work-image img,
  .work-image-placeholder {
    width: 100%;
    height: 100%;
  }

  .work-image img {
    display: block;
    object-fit: cover;
  }

  @media (max-width: 700px) {
    .work-image.is-portrait {
      width: min(82%, 340px);
    }
  }
</style>
