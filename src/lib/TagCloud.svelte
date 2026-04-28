<script lang="ts">
  let {
    categories = [],
    selected = $bindable('all'),
    show = true,
  }: {
    categories: string[]
    selected: string
    show?: boolean
  } = $props()
</script>

{#if show && categories.length > 0}
<div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
  <button
    onclick={() => { selected = 'all' }}
    class="chip {selected === 'all' ? 'preset-filled' : 'preset-tonal'}"
  >
    All
  </button>

  {#each categories as cat}
    <button
      onclick={() => { selected = cat }}
      class="chip {selected === cat ? 'preset-filled' : 'preset-tonal'}"
    >
      {cat}
    </button>
  {/each}
</div>
{/if}
