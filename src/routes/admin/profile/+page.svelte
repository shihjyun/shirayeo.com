<script lang="ts">
  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<main class="mx-auto max-w-6xl px-4 py-4">
  <section class="rounded-xl border border-zinc-300 bg-white/90 p-5">
    <h1 class="text-lg font-semibold">Profile</h1>
    <p class="mt-2 text-sm text-zinc-600">
      更新首頁顯示的自我介紹內容，會寫入 <code>data/profile.yaml</code>。
    </p>

    {#if form?.message}
      <p class="mt-3 text-sm text-zinc-700">{form.message}</p>
    {/if}

    <form class="mt-4 grid gap-3" method="POST" action="?/updateProfile">
      <label class="grid gap-1 text-sm">
        自我介紹
        <textarea
          class="min-h-48 rounded border border-zinc-300 px-3 py-2"
          name="intro"
          required
        >{data.profile.intro}</textarea>
      </label>

      <button
        type="submit"
        class="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm text-white"
      >
        儲存
      </button>
    </form>
  </section>
</main>
