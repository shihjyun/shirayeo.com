<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let cameraActive = $state(false);
</script>

<main class="page-shell">
  <section class="hero-card">
    <p class="hero-kicker">Shirayeo</p>
    <h1 class="hero-title">Drawing Portfolio</h1>
    <p class="hero-intro">
      我以手繪與複合媒材記錄日常觀察，專注於線條節奏、光影邊界與材質的細微變化。
    </p>
  </section>

  <section class="camera-card">
    <div class="camera-copy">
      <h2 class="section-title">Photo Zone</h2>
      <p class="section-description">
        目前收錄 {data.photos.length}
        張照片。先完成互動狀態切換，拍照與上傳流程會在後續 Phase 補上。
      </p>
    </div>
    <button
      type="button"
      class:camera-button={true}
      class:is-active={cameraActive}
      aria-pressed={cameraActive}
      onclick={() => (cameraActive = !cameraActive)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M8.5 5.75h7l1.2 1.75H20A2.25 2.25 0 0 1 22.25 9.75v8.5A2.25 2.25 0 0 1 20 20.5H4A2.25 2.25 0 0 1 1.75 18.25v-8.5A2.25 2.25 0 0 1 4 7.5h3.3l1.2-1.75ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-1.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Z"
        />
      </svg>
      <span>{cameraActive ? "Camera Active" : "Camera Inactive"}</span>
    </button>
  </section>

  <section class="gallery-card">
    <div class="gallery-head">
      <h2 class="section-title">Works</h2>
      <p class="section-description">
        目前作品資料由本地 `data/works.yaml` 讀取。
      </p>
    </div>
    <ul class="works-grid">
      {#each data.works as work}
        <li class="work-item">
          <h3>{work.work_name}</h3>
          <p class="meta">{work.created_date} · {work.materials}</p>
          <p>{work.description}</p>
        </li>
      {/each}
    </ul>
  </section>
</main>
