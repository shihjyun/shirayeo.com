<script lang="ts">
  import { fade } from "svelte/transition";

  interface ViewerPhoto {
    file_name: string;
    url: string;
  }

  let {
    photos,
    onClose,
  }: {
    photos: ViewerPhoto[];
    onClose: () => void;
  } = $props();

  let currentIndex = $state(0);
  let photoCursor = $state<"left" | "right">("right");
  let activeLayer = $state<0 | 1>(0);
  let layerPhoto0 = $state<ViewerPhoto | null>(null);
  let layerPhoto1 = $state<ViewerPhoto | null>(null);
  let layerReady0 = $state(false);
  let layerReady1 = $state(false);
  let preloadDirection = $state<1 | -1>(1);
  let pendingSwap = $state<{
    incomingLayer: 0 | 1;
    targetIndex: number;
    direction: 1 | -1;
  } | null>(null);

  function showPrevious(): void {
    if (photos.length === 0) return;
    requestSwap(-1);
  }

  function showNext(): void {
    if (photos.length === 0) return;
    requestSwap(1);
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowLeft") showPrevious();
    if (event.key === "ArrowRight") showNext();
  }

  function handlePhotoMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLButtonElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    photoCursor = x > rect.width / 2 ? "right" : "left";
  }

  function handlePhotoClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLButtonElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    if (x > rect.width / 2) {
      showNext();
      return;
    }
    showPrevious();
  }

  function setLayerPhoto(layer: 0 | 1, photo: ViewerPhoto | null): void {
    if (layer === 0) {
      layerPhoto0 = photo;
      layerReady0 = false;
      return;
    }
    layerPhoto1 = photo;
    layerReady1 = false;
  }

  function getLayerPhoto(layer: 0 | 1): ViewerPhoto | null {
    return layer === 0 ? layerPhoto0 : layerPhoto1;
  }

  function isLayerReady(layer: 0 | 1): boolean {
    return layer === 0 ? layerReady0 : layerReady1;
  }

  function setLayerReady(layer: 0 | 1): void {
    if (layer === 0) {
      layerReady0 = true;
      return;
    }
    layerReady1 = true;
  }

  function tryCommitPendingSwap(): void {
    if (!pendingSwap) return;
    const { incomingLayer, targetIndex, direction } = pendingSwap;
    const targetPhoto = photos[targetIndex];
    const incomingPhoto = getLayerPhoto(incomingLayer);
    if (!targetPhoto || !incomingPhoto) return;
    if (incomingPhoto.url !== targetPhoto.url) return;
    if (!isLayerReady(incomingLayer)) return;

    activeLayer = incomingLayer;
    currentIndex = targetIndex;
    preloadDirection = direction;
    pendingSwap = null;
    primeHiddenLayer(direction);
  }

  function onLayerLoad(layer: 0 | 1): void {
    setLayerReady(layer);
    tryCommitPendingSwap();
  }

  function requestSwap(direction: 1 | -1): void {
    if (photos.length < 2) return;

    const targetIndex = (currentIndex + direction + photos.length) % photos.length;
    const targetPhoto = photos[targetIndex];
    const incomingLayer: 0 | 1 = activeLayer === 0 ? 1 : 0;
    const incomingPhoto = getLayerPhoto(incomingLayer);

    if (incomingPhoto?.url !== targetPhoto.url) {
      setLayerPhoto(incomingLayer, targetPhoto);
    }

    pendingSwap = { incomingLayer, targetIndex, direction };
    tryCommitPendingSwap();
  }

  function primeHiddenLayer(direction: 1 | -1): void {
    if (photos.length < 2) return;

    const hiddenLayer: 0 | 1 = activeLayer === 0 ? 1 : 0;
    const targetIndex =
      (currentIndex + direction + photos.length) % photos.length;
    const targetPhoto = photos[targetIndex];
    const hiddenPhoto = getLayerPhoto(hiddenLayer);
    if (hiddenPhoto?.url === targetPhoto.url) return;
    setLayerPhoto(hiddenLayer, targetPhoto);
  }

  $effect(() => {
    const count = photos.length;
    if (count === 0) {
      currentIndex = 0;
      activeLayer = 0;
      preloadDirection = 1;
      pendingSwap = null;
      setLayerPhoto(0, null);
      setLayerPhoto(1, null);
      return;
    }

    currentIndex = 0;
    activeLayer = 0;
    preloadDirection = 1;
    pendingSwap = null;
    setLayerPhoto(0, photos[0]);
    setLayerPhoto(1, count > 1 ? photos[1] : null);
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="viewer"
  role="dialog"
  aria-modal="true"
  aria-label="照片閱覽器"
  in:fade={{ duration: 180 }}
  out:fade={{ duration: 220 }}
>
  <button class="nav-zone nav-zone-left" type="button" onclick={showPrevious}>
    <span class="sr-only">上一張</span>
  </button>

  <button class="nav-zone nav-zone-right" type="button" onclick={showNext}>
    <span class="sr-only">下一張</span>
  </button>

  <button class="close-btn" type="button" onclick={onClose} aria-label="關閉">
    ×
  </button>

  {#if photos.length > 0}
    <figure class="photo-frame">
      <button
        class={`photo-hit ${photoCursor === "right" ? "cursor-next" : "cursor-prev"}`}
        type="button"
        onmousemove={handlePhotoMove}
        onclick={handlePhotoClick}
        aria-label="點擊照片切換"
      >
        <div class="photo-stack">
          {#if layerPhoto0}
            <img
              src={layerPhoto0.url}
              alt={layerPhoto0.file_name}
              class={`photo photo-layer ${activeLayer === 0 && layerReady0 ? "is-active" : "is-hidden"}`}
              loading="eager"
              onload={() => onLayerLoad(0)}
              onerror={() => onLayerLoad(0)}
            />
          {/if}
          {#if layerPhoto1}
            <img
              src={layerPhoto1.url}
              alt={layerPhoto1.file_name}
              class={`photo photo-layer ${activeLayer === 1 && layerReady1 ? "is-active" : "is-hidden"}`}
              loading="eager"
              onload={() => onLayerLoad(1)}
              onerror={() => onLayerLoad(1)}
            />
          {/if}
        </div>
      </button>
    </figure>
  {:else}
    <p class="empty-text">目前沒有可瀏覽的照片。</p>
  {/if}
</div>

<style>
  .viewer {
    position: fixed;
    inset: 0;
    z-index: 1100;
    background: rgba(9, 12, 18, 0.92);
    display: grid;
    place-items: center;
    padding: 2.5rem 1.4rem;
  }

  .nav-zone {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50vw;
    border: 0;
    background: transparent;
    z-index: 1;
  }

  .nav-zone-left {
    left: 0;
    cursor: w-resize;
  }

  .nav-zone-right {
    right: 0;
    cursor: e-resize;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.4rem;
    height: 2.4rem;
    border: 0;
    background: transparent;
    color: #fff;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    z-index: 3;
  }

  .photo-frame {
    margin: 0;
    max-width: min(1200px, 92vw);
    max-height: 88vh;
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    z-index: 2;
  }

  .photo-hit {
    border: 0;
    background: transparent;
    padding: 0;
    line-height: 0;
  }

  .photo-stack {
    display: grid;
    place-items: center;
  }

  .photo {
    grid-area: 1 / 1;
    max-width: 100%;
    max-height: calc(88vh - 2rem);
    width: auto;
    height: auto;
    object-fit: contain;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
  }

  .photo-layer {
    opacity: 0;
  }

  .photo-layer.is-active {
    opacity: 1;
    transition: none;
  }

  .photo-layer.is-hidden {
    opacity: 0;
    transition: none;
  }

  .photo-hit.cursor-prev {
    cursor: w-resize;
  }

  .photo-hit.cursor-next {
    cursor: e-resize;
  }

  .empty-text {
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
    z-index: 2;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
