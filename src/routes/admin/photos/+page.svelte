<script lang="ts">
  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let fileInput = $state<HTMLInputElement | null>(null);
  let pendingFiles = $state<File[]>([]);
  let isDragging = $state(false);

  function syncInput(files: File[]): void {
    if (!fileInput) return;

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
  }

  function mergePending(nextFiles: File[]): void {
    const merged = [...pendingFiles, ...nextFiles];
    pendingFiles = merged;
    syncInput(merged);
  }

  function onInputChange(event: Event): void {
    const target = event.currentTarget as HTMLInputElement;
    const files = Array.from(target.files ?? []);
    mergePending(files);
  }

  function onDrop(event: DragEvent): void {
    event.preventDefault();
    isDragging = false;

    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length > 0) {
      mergePending(files);
    }
  }

  function removePending(index: number): void {
    const next = pendingFiles.filter((_, i) => i !== index);
    pendingFiles = next;
    syncInput(next);
  }
</script>

<main class="mx-auto max-w-6xl px-4 py-4">
  <header class="mb-4 rounded-xl border border-zinc-300 bg-white/90 p-4">
    <h1 class="text-lg font-semibold">Photos</h1>
    <p class="mt-1 text-sm text-zinc-600">
      拖拉照片到待上傳區，送出後會寫入 <code>data/photos.yaml</code>。
    </p>
    {#if form?.message}
      <p class="mt-2 text-sm text-amber-700">{form.message}</p>
    {/if}
  </header>

  <section class="grid gap-4 lg:grid-cols-2">
    <article class="rounded-xl border border-zinc-300 bg-white/90 p-4">
      <h2 class="text-base font-semibold">待上傳</h2>
      <form
        class="mt-3"
        method="POST"
        action="?/uploadPhotos"
        enctype="multipart/form-data"
      >
        <label
          class={`block cursor-pointer rounded-lg border-2 border-dashed p-6 text-center text-sm ${
            isDragging
              ? "border-zinc-900 bg-zinc-100"
              : "border-zinc-300 bg-zinc-50 hover:border-zinc-500"
          }`}
          ondragenter={() => (isDragging = true)}
          ondragover={(event) => event.preventDefault()}
          ondragleave={() => (isDragging = false)}
          ondrop={onDrop}
        >
          <input
            bind:this={fileInput}
            class="hidden"
            type="file"
            name="photos"
            multiple
            onchange={onInputChange}
          />
          將檔案拖拉到這裡，或點擊選擇檔案
        </label>

        {#if pendingFiles.length > 0}
          <ul class="mt-3 grid gap-2">
            {#each pendingFiles as file, index}
              <li
                class="flex items-center justify-between rounded border border-zinc-300 px-3 py-2 text-sm"
              >
                <span class="truncate">{file.name}</span>
                <button
                  type="button"
                  class="rounded border border-zinc-400 px-2 py-1 text-xs"
                  onclick={() => removePending(index)}
                >
                  移除
                </button>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="mt-3 text-sm text-zinc-500">目前沒有待上傳檔案。</p>
        {/if}

        <button
          type="submit"
          class="mt-3 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={pendingFiles.length === 0}
        >
          上傳待上傳檔案
        </button>
      </form>
    </article>

    <article class="rounded-xl border border-zinc-300 bg-white/90 p-4">
      <h2 class="text-base font-semibold">已上傳</h2>
      <ul class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
        {#each data.photos as photo, index}
          <li class="rounded border border-zinc-300 p-2">
            <img
              src={photo.url}
              alt={photo.file_name}
              class="aspect-square w-full rounded object-cover"
              loading="lazy"
            />
            <p class="mt-2 truncate text-xs font-medium">{photo.file_name}</p>
            <p class="mt-1 text-xs text-zinc-500">{photo.uploaded_at}</p>
            <form class="mt-2" method="POST" action="?/deletePhoto">
              <input type="hidden" name="index" value={index} />
              <button
                type="submit"
                class="rounded border border-red-500 px-2 py-1 text-xs text-red-700"
              >
                刪除
              </button>
            </form>
          </li>
        {/each}
      </ul>
    </article>
  </section>
</main>
