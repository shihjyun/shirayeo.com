<script lang="ts">
  let { children } = $props();
</script>

<div class="min-h-screen bg-zinc-100 text-zinc-900">
  <nav class="mx-auto flex max-w-6xl items-center gap-2 px-4 pt-6">
    <a
      href="/admin/works"
      class="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
      >Works</a
    >
    <a
      href="/admin/photos"
      class="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm"
      >Photos</a
    >
  </nav>

  {@render children()}
</div>
