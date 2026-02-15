<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/favicon.ico?v=20260215" sizes="any" />
  <link rel="shortcut icon" href="/favicon.ico?v=20260215" />
  <link rel="apple-touch-icon" href="/favicon.ico?v=20260215" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{@render children()}
