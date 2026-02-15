<script lang="ts">
  let {
    intro,
    onOpenPhotos,
    instagramHref = "https://www.instagram.com/0rayang1",
  }: {
    intro: string;
    onOpenPhotos?: () => void;
    instagramHref?: string;
  } = $props();

  function handleOpenPhotos(): void {
    onOpenPhotos?.();
  }
</script>

<section class="intro-block">
  <h1 class="intro-title">
    <img
      src="/cover.jpg"
      alt="shirayeo"
      class="intro-title-image"
      width="1100"
      height="344"
    />
  </h1>
  <div class="intro-actions" aria-label="social and photo actions">
    <a
      class="intro-icon"
      href={instagramHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" ry="5"></rect>
        <circle cx="12" cy="12" r="4.1"></circle>
        <circle cx="17.4" cy="6.6" r="1.05"></circle>
      </svg>
    </a>
    <button
      class="intro-icon"
      type="button"
      onclick={handleOpenPhotos}
      aria-label="開啟照片閱覽器"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 7h3.1l1.1-1.7h7.6L16.9 7H20a2 2 0 0 1 2 2v8.5A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5V9a2 2 0 0 1 2-2z"
        ></path>
        <circle cx="12" cy="13" r="4.1"></circle>
      </svg>
    </button>
  </div>
  <p class="intro-copy">{intro}</p>
</section>

<style>
  .intro-block {
    max-width: 600px;
    margin: 0 auto;
  }

  .intro-title {
    margin: 0;
    display: flex;
    justify-content: center;
  }

  .intro-title-image {
    display: block;
    width: min(100%, 300px);
    height: auto;
    aspect-ratio: 1100 / 344;
  }

  .intro-copy {
    margin: 1.8rem 0 0;
    color: var(--text);
    font-size: clamp(1.02rem, 1.3vw, 1.24rem);
    line-height: 1.78;
    letter-spacing: 0.01em;
  }

  .intro-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.6rem;
  }

  .intro-icon {
    width: 2rem;
    height: 2rem;
    border: 0;
    border-radius: 999px;
    background: transparent;
    padding: 0;
    display: inline-grid;
    place-items: center;
    color: #1c2c80;
    cursor: pointer;
    transition: opacity 120ms ease;
  }

  .intro-icon svg {
    width: 1.35rem;
    height: 1.35rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .intro-icon:hover {
    opacity: 0.68;
  }

  @media (max-width: 700px) {
    .intro-copy {
      margin-top: 1.2rem;
      font-size: 0.98rem;
      line-height: 1.72;
    }

    .intro-title-image {
      width: 60%;
    }
  }
</style>
