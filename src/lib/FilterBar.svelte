<script lang="ts">
  let {
    categories = [],
    authors = [],
    genres = [],
    costs = [],
    category = $bindable('all'),
    author = $bindable('all'),
    genre = $bindable('all'),
    cost = $bindable('all'),
  }: {
    categories: string[]
    authors: string[]
    genres: string[]
    costs: string[]
    category: string
    author: string
    genre: string
    cost: string
  } = $props()
</script>

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

  {#if category !== 'all' || author !== 'all' || genre !== 'all' || cost !== 'all'}
  <button
    onclick={() => { category = 'all'; author = 'all'; genre = 'all'; cost = 'all' }}
    class="btn preset-outlined text-xs"
  >
    Clear filters
  </button>
  {/if}

</div>
