<script lang="ts">
  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();
  let editorMode = $state<"edit" | "create">("edit");
  let createDigitalSize = $state("");
  let editDigitalSize = $state("");

  const selectedWork = $derived(
    data.selectedIndex >= 0 && data.works[data.selectedIndex]
      ? data.works[data.selectedIndex]
      : null,
  );

  const sortedWorkEntries = $derived(
    data.works
      .map((work, index) => ({
        index,
        work,
        timestamp: Number.isNaN(Date.parse(work.created_date))
          ? Number.NEGATIVE_INFINITY
          : Date.parse(work.created_date),
      }))
      .sort((a, b) => b.timestamp - a.timestamp),
  );

  $effect(() => {
    editDigitalSize = selectedWork?.digital_size ?? "";
  });

  async function getImageSize(file: File): Promise<string> {
    if (!file.type.startsWith("image/")) return "";

    const objectUrl = URL.createObjectURL(file);
    try {
      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          const image = new Image();
          image.onload = () =>
            resolve({ width: image.naturalWidth, height: image.naturalHeight });
          image.onerror = () => reject(new Error("Image load failed"));
          image.src = objectUrl;
        },
      );

      return `${dimensions.width} x ${dimensions.height}`;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  async function onCreateCoverChange(event: Event): Promise<void> {
    const target = event.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const size = await getImageSize(file);
    if (size) createDigitalSize = size;
  }

  async function onEditCoverChange(event: Event): Promise<void> {
    const target = event.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const size = await getImageSize(file);
    if (size) editDigitalSize = size;
  }

  function openCreatePanel(): void {
    editorMode = "create";
    createDigitalSize = "";
  }

  function openEditPanel(): void {
    editorMode = "edit";
  }
</script>

<main class="mx-auto grid max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[260px_1fr]">
  <aside class="rounded-xl border border-zinc-300 bg-white/90 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h1 class="text-base font-semibold">Works</h1>
      <button
        type="button"
        class="rounded-md bg-zinc-900 px-3 py-1.5 text-xs text-white"
        onclick={openCreatePanel}
      >
        Add Work
      </button>
    </div>

    <ul class="grid gap-2">
      {#each sortedWorkEntries as entry}
        <li>
          <a
            href={`/admin/works?index=${entry.index}`}
            onclick={openEditPanel}
            class={`block rounded-md border px-3 py-2 text-sm ${
              entry.index === data.selectedIndex && editorMode === "edit"
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-300 bg-white text-zinc-800"
            }`}
          >
            <p class="font-medium">{entry.work.work_name || "Untitled"}</p>
            <p class="text-xs opacity-80">{entry.work.created_date}</p>
          </a>
        </li>
      {/each}
    </ul>
  </aside>

  <section class="rounded-xl border border-zinc-300 bg-white/90 p-5">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">
        {editorMode === "create" ? "Add Work" : "Edit Work"}
      </h2>
      {#if editorMode === "create"}
        <button
          type="button"
          class="rounded border border-zinc-300 px-3 py-1.5 text-xs"
          onclick={() => (editorMode = "edit")}
        >
          Back to Edit
        </button>
      {/if}
    </div>

    {#if form?.message}
      <p class="mt-2 text-sm text-amber-700">{form.message}</p>
    {/if}

    {#if editorMode === "create"}
      <form
        class="mt-4 grid gap-3 md:grid-cols-2"
        method="POST"
        action="?/createWork"
        enctype="multipart/form-data"
      >
        <label class="grid gap-1 text-sm">
          work_name
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="work_name"
            required
          />
        </label>

        <label class="grid gap-1 text-sm">
          created_date
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="created_date"
            placeholder="YYYY-MM-DD"
            required
          />
        </label>

        <label class="grid gap-1 text-sm">
          materials
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="materials"
            required
          />
        </label>

        <label class="grid gap-1 text-sm">
          real_size
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="real_size"
            required
          />
        </label>

        <label class="grid gap-1 text-sm">
          digital_size
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="digital_size"
            bind:value={createDigitalSize}
          />
        </label>

        <label class="grid gap-1 text-sm">
          layout
          <select class="rounded border border-zinc-300 px-3 py-2" name="layout">
            <option value="直">直</option>
            <option value="橫">橫</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm md:col-span-2">
          cover_image_url
          <input class="rounded border border-zinc-300 px-3 py-2" name="cover_image_url" />
        </label>

        <label class="grid gap-1 text-sm md:col-span-2">
          cover_image_file
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="cover_image_file"
            type="file"
            accept="image/*"
            onchange={onCreateCoverChange}
          />
        </label>

        <label class="grid gap-1 text-sm md:col-span-2">
          description
          <textarea class="rounded border border-zinc-300 px-3 py-2" name="description" rows="4"></textarea>
        </label>

        <button
          class="rounded bg-zinc-900 px-4 py-2 text-sm text-white md:col-span-2"
          type="submit"
        >
          Create
        </button>
      </form>
    {:else if selectedWork && data.selectedIndex >= 0}
      <form
        class="mt-4 grid gap-3 md:grid-cols-2"
        method="POST"
        action="?/updateWork"
        enctype="multipart/form-data"
      >
        <input type="hidden" name="index" value={data.selectedIndex} />

        <label class="grid gap-1 text-sm">
          work_name
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="work_name"
            value={selectedWork.work_name}
            required
          />
        </label>

        <label class="grid gap-1 text-sm">
          created_date
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="created_date"
            value={selectedWork.created_date}
            required
          />
        </label>

        <label class="grid gap-1 text-sm">
          materials
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="materials"
            value={selectedWork.materials}
            required
          />
        </label>

        <label class="grid gap-1 text-sm">
          real_size
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="real_size"
            value={selectedWork.real_size}
            required
          />
        </label>

        <label class="grid gap-1 text-sm">
          digital_size
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="digital_size"
            bind:value={editDigitalSize}
          />
        </label>

        <label class="grid gap-1 text-sm">
          layout
          <select class="rounded border border-zinc-300 px-3 py-2" name="layout">
            <option value="直" selected={selectedWork.layout === "直"}>直</option>
            <option value="橫" selected={selectedWork.layout === "橫"}>橫</option>
          </select>
        </label>

        <label class="grid gap-1 text-sm md:col-span-2">
          cover_image_url
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="cover_image_url"
            value={selectedWork.cover_image_url}
          />
        </label>

        <label class="grid gap-1 text-sm md:col-span-2">
          cover_image_file
          <input
            class="rounded border border-zinc-300 px-3 py-2"
            name="cover_image_file"
            type="file"
            accept="image/*"
            onchange={onEditCoverChange}
          />
        </label>

        <label class="grid gap-1 text-sm md:col-span-2">
          description
          <textarea
            class="rounded border border-zinc-300 px-3 py-2"
            name="description"
            rows="4">{selectedWork.description}</textarea
          >
        </label>

        <button
          class="rounded bg-zinc-900 px-4 py-2 text-sm text-white md:col-span-2"
          type="submit"
        >
          Save Changes
        </button>
      </form>

      <form class="mt-3" method="POST" action="?/deleteWork">
        <input type="hidden" name="index" value={data.selectedIndex} />
        <button
          class="rounded border border-red-500 px-3 py-2 text-sm text-red-700"
          type="submit"
        >
          Delete This Work
        </button>
      </form>
    {:else}
      <p class="mt-3 text-sm text-zinc-600">
        目前沒有作品。請按 Add Work 建立第一筆資料。
      </p>
    {/if}
  </section>
</main>
