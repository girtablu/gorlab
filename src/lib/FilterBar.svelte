<script lang="ts">
  import type { SortOption } from './filters.js'

  let {
    categories = [],
    authors = [],
    genres = [],
    costs = [],
    category = $bindable('all'),
    author = $bindable('all'),
    genre = $bindable('all'),
    cost = $bindable('all'),
    sort = $bindable<SortOption>('newest'),
    show = true,
  }: {
    categories: string[]
    authors: string[]
    genres: string[]
    costs: string[]
    category: string
    author: string
    genre: string
    cost: string
    sort: SortOption
    show?: boolean
  } = $props()

  const isDirty = $derived(
    category !== 'all' || author !== 'all' || genre !== 'all' || cost !== 'all' || sort !== 'newest'
  )

  function clearAll() {
    category = 'all'
    author = 'all'
    genre = 'all'
    cost = 'all'
    sort = 'newest'
  }
</script>

{#if show}
<div class="flex flex-wrap gap-2">

  <select class="select" bind:value={category}>
    <option value="all">All Categories</option>
    {#each categories as cat}<option value={cat}>{cat}</option>{/each}
  </select>

  <select class="select" bind:value={author}>
    <option value="all">All Authors</option>
    {#each authors as a}<option value={a}>{a}</option>{/each}
  </select>

  <select class="select" bind:value={genre}>
    <option value="all">All Genres</option>
    {#each genres as g}<option value={g}>{g}</option>{/each}
  </select>

  <select class="select" bind:value={cost}>
    <option value="all">All Costs</option>
    {#each costs as c}<option value={c}>{c}</option>{/each}
  </select>

  <div class="flex items-center gap-2 ml-auto">
    <label for="sort-select" class="text-xs opacity-60 whitespace-nowrap">Sort by</label>
    <select id="sort-select" class="select text-sm" bind:value={sort}>
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="az">A–Z</option>
      <option value="za">Z–A</option>
    </select>
  </div>

  {#if isDirty}
  <button onclick={clearAll} class="btn preset-outlined text-xs">
    Clear filters
  </button>
  {/if}

</div>
{/if}
