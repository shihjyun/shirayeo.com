<script lang="ts">
  let { intro }: { intro: string } = $props();
</script>

<section class="intro-block">
  <h1 class="intro-title"><span>shirayeo</span></h1>
  <p class="intro-copy">{intro}</p>
</section>

<style>
  .intro-block {
    max-width: 640px;
    margin: 0 auto;
  }

  .intro-title {
    margin: 0;
    text-align: center;
    font-size: clamp(2.4rem, 4vw, 3.2rem);
    font-weight: 500;
  }

  .intro-title span {
    text-decoration-line: underline;
    text-decoration-color: var(--line);
    text-decoration-thickness: 0.24rem;
    text-underline-offset: 0.22rem;
  }

  .intro-copy {
    margin: 2.4rem 0 0;
    color: var(--text);
    font-size: clamp(1.4rem, 2.2vw, 1.95rem);
    line-height: 1.34;
    letter-spacing: 0.01em;
  }

  @media (max-width: 700px) {
    .intro-copy {
      margin-top: 1.4rem;
      font-size: 1.2rem;
      line-height: 1.56;
    }
  }
</style>
