<script lang="ts">
  import { onMount } from 'svelte'
  import { afterNavigate } from '$app/navigation'
  import { base } from '$app/paths'

  interface PagefindResult {
    url: string
    excerpt: string
    meta: { title?: string }
  }

  let query = $state('')
  let results = $state<PagefindResult[]>([])
  let loading = $state(false)
  let unavailable = $state(false)

  let pagefindModule: { search: (q: string) => Promise<{ results: { data: () => Promise<PagefindResult> }[] }>, options: (o: object) => Promise<void> } | null = null

  async function runSearch(q: string) {
    if (!q) { results = []; return }
    loading = true
    try {
      if (!pagefindModule) {
        pagefindModule = await import(/* @vite-ignore */ `${base}/pagefind/pagefind.js`)
        if (base) await pagefindModule!.options({ baseUrl: base })
      }
      const search = await pagefindModule!.search(q)
      results = await Promise.all(search.results.map(r => r.data()))
    } catch {
      unavailable = true
    } finally {
      loading = false
    }
  }

  function readQuery() {
    query = new URLSearchParams(window.location.search).get('q') ?? ''
  }

  onMount(readQuery)
  afterNavigate(readQuery)

  $effect(() => { runSearch(query) })
</script>

<svelte:head>
  <title>{query ? `Search: ${query}` : 'Search'}</title>
</svelte:head>

<div class="px-4 py-6 max-w-3xl mx-auto">
  <h1 class="text-2xl font-bold mb-6">
    {#if query}Search results for "<span class="text-primary-500">{query}</span>"{:else}Search{/if}
  </h1>

  {#if loading}
    <p class="opacity-50 text-sm">Searching…</p>
  {:else if unavailable}
    <div class="border border-dashed border-current rounded p-6 text-center opacity-50">
      <p class="text-sm">Search index not available.</p>
      <p class="text-xs mt-1">Run <code>npm run build</code> to generate the search index.</p>
    </div>
  {:else if !query}
    <p class="opacity-50 text-sm">Enter a search term to get started.</p>
  {:else if results.length === 0}
    <p class="opacity-50 text-sm">No results found for "{query}".</p>
  {:else}
    <p class="text-xs opacity-50 mb-6">{results.length} result{results.length === 1 ? '' : 's'}</p>
    <ul class="flex flex-col divide-y divide-surface-200-800">
      {#each results as result}
        <li class="py-4">
          <a href={result.url} class="group flex flex-col gap-1">
            <span class="font-semibold group-hover:underline">{result.meta.title ?? result.url}</span>
            <span class="text-sm opacity-70 [&_mark]:bg-primary-500/30 [&_mark]:rounded">{@html result.excerpt}</span>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>
