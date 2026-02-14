<script lang="ts">
  import type { Work } from "$lib/types";

  import WorkCard from "./WorkCard.svelte";

  let { works }: { works: Work[] } = $props();
</script>

<section class="works-section">
  <p class="works-kicker">selected works</p>
  <h2 class="works-title">作品</h2>
  <ul class="works-list">
    {#each works as work}
      <li><WorkCard {work} /></li>
    {/each}
  </ul>
</section>

<style>
  .works-section {
    margin-top: 7.25rem;
  }

  .works-kicker {
    margin: 0;
    color: #8399a2;
    text-align: center;
    font-size: 0.75rem;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    font-family: var(--font-display);
  }

  .works-title {
    margin: 0.45rem 0 0;
    color: #161374;
    text-align: center;
    font-size: clamp(2rem, 3vw, 2.55rem);
    font-weight: 620;
    letter-spacing: 0.08em;
  }

  .works-list {
    margin: 3rem 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 5rem;
  }

  @media (max-width: 700px) {
    .works-section {
      margin-top: 4.2rem;
    }

    .works-list {
      margin-top: 1.8rem;
      gap: 2.9rem;
    }
  }
</style>
