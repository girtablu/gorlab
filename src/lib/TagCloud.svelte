<script lang="ts">
  import { ToggleGroup } from '@ark-ui/svelte/toggle-group'

  let {
    categories = [],
    selected = $bindable('all'),
  }: {
    categories: string[]
    selected: string
  } = $props()

  const toggleValue = $derived(selected === 'all' ? [] : [selected])
</script>

{#if categories.length > 0}
<div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
  <button
    onclick={() => { selected = 'all' }}
    class="text-xs px-3 py-1 border border-current rounded-full transition-colors {selected === 'all' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'}"
  >
    All
  </button>

  <ToggleGroup.Root
    value={toggleValue}
    onValueChange={(d) => { selected = d.value[0] ?? 'all' }}
    class="contents"
  >
    {#each categories as cat}
      <ToggleGroup.Item
        value={cat}
        class="text-xs px-3 py-1 border border-current rounded-full bg-transparent transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black data-[state=on]:bg-black data-[state=on]:text-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-black"
      >
        {cat}
      </ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
</div>
{/if}
