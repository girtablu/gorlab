<script lang="ts">
  import { onMount, untrack } from 'svelte'
  import { replaceState } from '$app/navigation'
  import { applySearch, applyFilters, sortPosts, paginate } from '$lib/filters.js'
  import type { SortOption } from '$lib/filters.js'
  import CardGrid from '$lib/CardGrid.svelte'
  import FilterBar from '$lib/FilterBar.svelte'
  import SearchInput from '$lib/SearchInput.svelte'
  import TagCloud from '$lib/TagCloud.svelte'
  import Pagination from '$lib/Pagination.svelte'

  const { data } = $props()

  let search = $state('')
  let filterCategory = $state('all')
  let filterAuthor = $state('all')
  let filterGenre = $state('all')
  let filterCost = $state('all')
  let sort = $state<SortOption>('newest')
  let currentPage = $state(1)
  let mounted = $state(false)

  onMount(() => {
    const p = new URLSearchParams(window.location.search)
    search = p.get('q') ?? ''
    filterCategory = p.get('category') ?? 'all'
    filterAuthor = p.get('author') ?? 'all'
    filterGenre = p.get('genre') ?? 'all'
    filterCost = p.get('cost') ?? 'all'
    sort = (p.get('sort') ?? 'newest') as SortOption
    mounted = true
  })

  // Reset to page 1 whenever filter/search/sort state changes
  const filterKey = $derived(
    `${search}|${filterCategory}|${filterAuthor}|${filterGenre}|${filterCost}|${sort}`
  )
  $effect(() => {
    filterKey
    untrack(() => { currentPage = 1 })
  })

  // Keep URL params in sync with filter state (shareable links)
  $effect(() => {
    if (!mounted) return
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (filterCategory !== 'all') p.set('category', filterCategory)
    if (filterAuthor !== 'all') p.set('author', filterAuthor)
    if (filterGenre !== 'all') p.set('genre', filterGenre)
    if (filterCost !== 'all') p.set('cost', filterCost)
    if (sort !== 'newest') p.set('sort', sort)
    const qs = p.toString()
    replaceState(qs ? `?${qs}` : '?', {})
  })

  const filtered = $derived(
    applyFilters(
      applySearch(data.posts, search),
      { category: filterCategory, author: filterAuthor, genre: filterGenre, cost: filterCost }
    )
  )
  const sorted = $derived(sortPosts(filtered, sort))
  const { items: paginated, totalPages } = $derived(
    paginate(sorted, currentPage, data.config.postsPerPage)
  )
</script>

<div class="px-4 py-6 max-w-7xl mx-auto">
  <div class="flex flex-col gap-3 mb-6">
    <SearchInput bind:value={search} />

    <TagCloud
      categories={data.categories}
      bind:selected={filterCategory}
      show={data.config.showTagCloud}
    />

    <FilterBar
      categories={data.categories}
      authors={data.authors}
      genres={data.genres}
      costs={data.costs}
      bind:category={filterCategory}
      bind:author={filterAuthor}
      bind:genre={filterGenre}
      bind:cost={filterCost}
      bind:sort={sort}
      show={data.config.showFilterBar}
    />
  </div>

  <p class="text-xs opacity-50 mb-4">
    {filtered.length} resource{filtered.length === 1 ? '' : 's'}
  </p>

  <CardGrid posts={paginated} />

  {#if totalPages > 1}
    <div class="mt-8 flex justify-center">
      <Pagination
        count={filtered.length}
        pageSize={data.config.postsPerPage}
        bind:page={currentPage}
      />
    </div>
  {/if}
</div>
