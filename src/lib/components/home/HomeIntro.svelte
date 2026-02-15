<script lang="ts">
  const triggerText = "生活片段";

  let {
    intro,
    onOpenPhotos,
  }: {
    intro: string;
    onOpenPhotos?: () => void;
  } = $props();

  const introParts = $derived(intro.split(triggerText));
  const hasTrigger = $derived(intro.includes(triggerText));

  function handleOpenPhotos(): void {
    onOpenPhotos?.();
  }
</script>

<section class="intro-block">
  <h1 class="intro-title"><span>shirayeo</span></h1>
  <p class="intro-copy">
    {#if hasTrigger}
      {#each introParts as part, index}
        {part}
        {#if index < introParts.length - 1}
          <button
            class="photo-trigger"
            type="button"
            onclick={handleOpenPhotos}
          >
            {triggerText}
          </button>
        {/if}
      {/each}
    {:else}
      {intro}
    {/if}
  </p>
</section>

<style>
  .intro-block {
    max-width: 700px;
    margin: 0 auto;
  }

  .intro-title {
    margin: 0;
    text-align: center;
    font-size: clamp(2rem, 3.2vw, 2.6rem);
    font-weight: 520;
    line-height: 1.08;
    font-family: var(--font-display);
  }

  .intro-title span {
    text-decoration-line: underline;
    text-decoration-color: var(--line);
    text-decoration-thickness: 0.16rem;
    text-underline-offset: 0.18rem;
  }

  .intro-copy {
    margin: 1.8rem 0 0;
    color: var(--text);
    font-size: clamp(1.02rem, 1.3vw, 1.24rem);
    line-height: 1.78;
    letter-spacing: 0.01em;
  }

  .photo-trigger {
    border: 0;
    background: transparent;
    color: #1a2767;
    font: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    padding: 0;
    text-decoration-line: underline;
    text-decoration-thickness: 0.11rem;
    text-underline-offset: 0.12rem;
    cursor: pointer;
  }

  .photo-trigger:hover {
    opacity: 0.75;
  }

  @media (max-width: 700px) {
    .intro-copy {
      margin-top: 1.2rem;
      font-size: 0.98rem;
      line-height: 1.72;
    }
  }
</style>
