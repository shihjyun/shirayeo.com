<script lang="ts">
  import type { Work } from "$lib/types";

  import WorkCard from "./WorkCard.svelte";

  let { works }: { works: Work[] } = $props();
</script>

<section class="works-section">
  <h2 class="works-title">作品</h2>
  <ul class="works-list">
    {#each works as work}
      <li><WorkCard {work} /></li>
    {/each}
  </ul>
</section>

<style>
  .works-section {
    margin-top: 12rem;
  }

  .works-title {
    margin: 0;
    color: var(--muted);
    text-align: center;
    font-size: clamp(3rem, 4.6vw, 4rem);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  .works-list {
    margin: 4.8rem 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 7.5rem;
  }

  @media (max-width: 700px) {
    .works-section {
      margin-top: 5.2rem;
    }

    .works-list {
      margin-top: 2.2rem;
      gap: 3.8rem;
    }
  }
</style>
