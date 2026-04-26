<script lang="ts">
  import { onMount } from 'svelte'
  import CardGrid from './lib/CardGrid.svelte'
  import FilterBar from './lib/FilterBar.svelte'
  import SearchInput from './lib/SearchInput.svelte'
  import TagCloud from './lib/TagCloud.svelte'
  import Pagination from './lib/Pagination.svelte'

  export interface Post {
    slug: string
    url: string
    name: string
    category: string | string[]
    author: string | string[]
    source: string
    'source-url': string
    genre: string
    summary: string
    cost: string
    license: string
    'cover-image': string
    tags: string | string[]
    stats: string
    subtext1: string
    subtext2: string
    subtext3: string
    subtext4: string
    inspiration: string
    'inspiration-url': string
  }

  let { baseurl = '', postsPerPage = 24 }: { baseurl: string; postsPerPage: number } = $props()

  let posts = $state<Post[]>([])
  let loading = $state(true)
  let fetchError = $state<string | null>(null)

  let search = $state('')
  let filterCategory = $state('all')
  let filterAuthor = $state('all')
  let filterGenre = $state('all')
  let filterCost = $state('all')
  let currentPage = $state(1)

  onMount(async () => {
    try {
      const res = await fetch(`${baseurl}/output.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      posts = await res.json()
    } catch (e) {
      fetchError = 'Failed to load content. Make sure output.json is present.'
    } finally {
      loading = false
    }
  })

  function toArray(val: string | string[] | null | undefined): string[] {
    if (!val) return []
    return Array.isArray(val) ? val : [val]
  }

  function normalize(s: string | null | undefined): string {
    return (s ?? '').toLowerCase().trim()
  }

  function matchesSearch(post: Post, q: string): boolean {
    if (!q) return true
    const lq = q.toLowerCase()
    const haystack = [
      post.name,
      post.summary,
      ...toArray(post.author),
      ...toArray(post.tags),
      ...toArray(post.category),
    ]
      .map(normalize)
      .join(' ')
    return haystack.includes(lq)
  }

  function matchesCategory(post: Post, cat: string): boolean {
    return toArray(post.category).some((c) => normalize(c) === normalize(cat))
  }

  function matchesField(val: string | string[] | null | undefined, filter: string): boolean {
    return toArray(val as string[]).some((v) => normalize(v) === normalize(filter))
  }

  const filtered = $derived(
    posts.filter((post) => {
      if (!matchesSearch(post, search)) return false
      if (filterCategory !== 'all' && !matchesCategory(post, filterCategory)) return false
      if (filterAuthor !== 'all' && !matchesField(post.author, filterAuthor)) return false
      if (filterGenre !== 'all' && normalize(post.genre) !== normalize(filterGenre)) return false
      if (filterCost !== 'all' && normalize(post.cost) !== normalize(filterCost)) return false
      return true
    })
  )

  const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / postsPerPage)))

  const paginated = $derived(
    filtered.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
  )

  const categories = $derived(
    [...new Set(posts.flatMap((p) => toArray(p.category)))].filter(Boolean).sort()
  )
  const authors = $derived(
    [...new Set(posts.flatMap((p) => toArray(p.author)))].filter(Boolean).sort()
  )
  const genres = $derived([...new Set(posts.map((p) => p.genre))].filter(Boolean).sort())
  const costs = $derived([...new Set(posts.map((p) => p.cost))].filter(Boolean).sort())

  // Reset to page 1 when any filter changes
  const filterKey = $derived(
    `${search}|${filterCategory}|${filterAuthor}|${filterGenre}|${filterCost}`
  )
  $effect(() => {
    filterKey
    currentPage = 1
  })
</script>

{#if loading}
  <div class="flex items-center justify-center min-h-64">
    <p class="opacity-50 text-sm">Loading…</p>
  </div>
{:else if fetchError}
  <div class="flex items-center justify-center min-h-64">
    <p class="text-red-500 text-sm">{fetchError}</p>
  </div>
{:else}
  <div class="px-4 py-6 max-w-7xl mx-auto">

    <div class="flex flex-col gap-3 mb-6">
      <SearchInput bind:value={search} />
      <FilterBar
        {categories}
        {authors}
        {genres}
        {costs}
        bind:category={filterCategory}
        bind:author={filterAuthor}
        bind:genre={filterGenre}
        bind:cost={filterCost}
      />
      <TagCloud {categories} bind:selected={filterCategory} />
    </div>

    <p class="text-xs opacity-50 mb-4">{filtered.length} resource{filtered.length === 1 ? '' : 's'}</p>

    <CardGrid posts={paginated} />

    {#if totalPages > 1}
      <div class="mt-8 flex justify-center">
        <Pagination
          count={filtered.length}
          pageSize={postsPerPage}
          bind:page={currentPage}
        />
      </div>
    {/if}

  </div>
{/if}
