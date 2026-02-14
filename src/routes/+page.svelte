<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let cameraActive = $state(false);

  const works = $derived(
    [...data.works].sort(
      (a, b) => Date.parse(b.created_date) - Date.parse(a.created_date),
    ),
  );

  const pageTitle = "Shirayeo Portfolio | Drawing Works";
  const pageDescription =
    "Shirayeo 的手繪與複合媒材作品集，收錄畫作資訊與照片紀錄。";
  const ogImage = "/favicon.svg";

  function displayYear(date: string): string {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? date : String(parsed.getFullYear());
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={ogImage} />
</svelte:head>

<main class="page-shell">
  <section class="hero-card">
    <p class="hero-kicker">Shirayeo</p>
    <h1 class="hero-title">Drawing Portfolio</h1>
    <p class="hero-intro">
      我以手繪與複合媒材記錄日常觀察，專注於線條節奏、光影邊界與材質的細微變化。
      目前收錄 {works.length} 件畫作與 {data.photos.length} 張照片。
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
        依創作日期由新到舊排列，完整顯示每件作品資訊。
      </p>
    </div>
    <ul class="works-grid">
      {#each works as work}
        <li class="work-item">
          <div
            class={`work-cover ${work.layout === "橫" ? "is-landscape" : "is-portrait"}`}
          >
            {#if work.cover_image_url}
              <img
                src={work.cover_image_url}
                alt={work.work_name}
                loading="lazy"
              />
            {:else}
              <div class="work-cover-placeholder" aria-hidden="true">
                <span>{work.layout === "橫" ? "Landscape" : "Portrait"}</span>
              </div>
            {/if}
          </div>

          <div class="work-content">
            <h3>{work.work_name}</h3>
            <p class="meta">
              {displayYear(work.created_date)} · {work.materials}
            </p>

            <dl class="work-facts">
              <div>
                <dt>創作日期</dt>
                <dd>{work.created_date}</dd>
              </div>
              <div>
                <dt>實體尺寸</dt>
                <dd>{work.real_size || "-"}</dd>
              </div>
              <div>
                <dt>數位尺寸</dt>
                <dd>{work.digital_size || "-"}</dd>
              </div>
              <div>
                <dt>版型</dt>
                <dd>{work.layout}</dd>
              </div>
            </dl>

            <p class="work-description">{work.description || "尚未填寫描述"}</p>
          </div>
        </li>
      {/each}
    </ul>
  </section>
</main>
