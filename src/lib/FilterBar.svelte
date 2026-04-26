<script lang="ts">
  import { Portal } from '@ark-ui/svelte/portal'
  import { Select, createListCollection } from '@ark-ui/svelte/select'

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

  function makeCollection(label: string, items: string[]) {
    return createListCollection({
      items: [
        { label: `All ${label}`, value: 'all' },
        ...items.map((i) => ({ label: i, value: i })),
      ],
    })
  }

  const categoryCol = $derived(makeCollection('Categories', categories))
  const authorCol = $derived(makeCollection('Authors', authors))
  const genreCol = $derived(makeCollection('Genres', genres))
  const costCol = $derived(makeCollection('Costs', costs))

  const triggerClass = "flex items-center gap-1 border border-current px-3 py-1.5 text-xs rounded bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
  const contentClass = "z-50 min-w-40 max-h-72 overflow-y-auto bg-white dark:bg-black border border-current rounded shadow-lg py-1 [&[data-state=open]]:animate-[scale-fade-in_0.1s_ease-out] [&[data-state=closed]]:animate-[scale-fade-out_0.1s_ease-in] outline-none"
  const itemClass = "flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer data-[highlighted]:bg-black data-[highlighted]:text-white dark:data-[highlighted]:bg-white dark:data-[highlighted]:text-black data-[state=checked]:font-semibold"
</script>

{#snippet chevron()}
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6"/>
  </svg>
{/snippet}

{#snippet selectItems(col: ReturnType<typeof makeCollection>)}
  <Select.ItemGroup>
    {#each col.items as item}
      <Select.Item {item} class={itemClass}>
        <Select.ItemText>{item.label}</Select.ItemText>
        <Select.ItemIndicator class="text-[10px]">✓</Select.ItemIndicator>
      </Select.Item>
    {/each}
  </Select.ItemGroup>
{/snippet}

<div class="flex flex-wrap gap-2">

  <!-- Category -->
  <Select.Root collection={categoryCol} value={[category]} onValueChange={(d) => { category = d.value[0] ?? 'all' }}>
    <Select.Control>
      <Select.Trigger class={triggerClass}>
        <Select.ValueText placeholder="Category" />
        {@render chevron()}
      </Select.Trigger>
    </Select.Control>
    <Portal>
      <Select.Positioner>
        <Select.Content class={contentClass}>
          {@render selectItems(categoryCol)}
        </Select.Content>
      </Select.Positioner>
    </Portal>
    <Select.HiddenSelect />
  </Select.Root>

  <!-- Author -->
  <Select.Root collection={authorCol} value={[author]} onValueChange={(d) => { author = d.value[0] ?? 'all' }}>
    <Select.Control>
      <Select.Trigger class={triggerClass}>
        <Select.ValueText placeholder="Author" />
        {@render chevron()}
      </Select.Trigger>
    </Select.Control>
    <Portal>
      <Select.Positioner>
        <Select.Content class={contentClass}>
          {@render selectItems(authorCol)}
        </Select.Content>
      </Select.Positioner>
    </Portal>
    <Select.HiddenSelect />
  </Select.Root>

  <!-- Genre -->
  <Select.Root collection={genreCol} value={[genre]} onValueChange={(d) => { genre = d.value[0] ?? 'all' }}>
    <Select.Control>
      <Select.Trigger class={triggerClass}>
        <Select.ValueText placeholder="Genre" />
        {@render chevron()}
      </Select.Trigger>
    </Select.Control>
    <Portal>
      <Select.Positioner>
        <Select.Content class={contentClass}>
          {@render selectItems(genreCol)}
        </Select.Content>
      </Select.Positioner>
    </Portal>
    <Select.HiddenSelect />
  </Select.Root>

  <!-- Cost -->
  <Select.Root collection={costCol} value={[cost]} onValueChange={(d) => { cost = d.value[0] ?? 'all' }}>
    <Select.Control>
      <Select.Trigger class={triggerClass}>
        <Select.ValueText placeholder="Cost" />
        {@render chevron()}
      </Select.Trigger>
    </Select.Control>
    <Portal>
      <Select.Positioner>
        <Select.Content class={contentClass}>
          {@render selectItems(costCol)}
        </Select.Content>
      </Select.Positioner>
    </Portal>
    <Select.HiddenSelect />
  </Select.Root>

  <!-- Reset all -->
  {#if category !== 'all' || author !== 'all' || genre !== 'all' || cost !== 'all'}
  <button
    onclick={() => { category = 'all'; author = 'all'; genre = 'all'; cost = 'all' }}
    class="text-xs underline opacity-60 hover:opacity-100"
  >
    Clear filters
  </button>
  {/if}

</div>
