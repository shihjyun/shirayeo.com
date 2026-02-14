<script lang="ts">
  let cameraActive = false;

  const works = [
    {
      title: "靜默之所",
      year: "2025",
      materials: "炭筆、石墨",
      description: "在靜止與呼吸之間，描繪內在空間的微弱光線。",
    },
    {
      title: "琢磨",
      year: "2024",
      materials: "炭筆、石墨",
      description: "反覆修整的痕跡，保留手勢與時間交疊後的質地。",
    },
    {
      title: "沿岸筆記",
      year: "2023",
      materials: "色鉛筆、墨",
      description: "以低飽和色層記錄海邊日常，聚焦於形體邊界。",
    },
  ];
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
        先完成互動狀態切換，拍照與上傳流程會在後續 Phase 補上。
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
        Phase 2 使用假資料呈現作品清單，Phase 3 會改接本地 YAML。
      </p>
    </div>
    <ul class="works-grid">
      {#each works as work}
        <li class="work-item">
          <h3>{work.title}</h3>
          <p class="meta">{work.year} · {work.materials}</p>
          <p>{work.description}</p>
        </li>
      {/each}
    </ul>
  </section>
</main>
