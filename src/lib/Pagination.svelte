<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte'
  import { Pagination } from '@ark-ui/svelte/pagination'

  let {
    count,
    pageSize,
    page = $bindable(1),
  }: {
    count: number
    pageSize: number
    page: number
  } = $props()
</script>

<Pagination.Root
  {count}
  {pageSize}
  siblingCount={1}
  bind:page
>
  <div class="flex items-center gap-1">
    <Pagination.PrevTrigger
      class="inline-flex items-center justify-center w-8 h-8 border border-current rounded text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <ChevronLeft size={14} />
    </Pagination.PrevTrigger>

    <Pagination.Context>
      {#snippet render(pagination)}
        {#each pagination().pages as p, i (i)}
          {#if p.type === 'page'}
            <Pagination.Item
              {...p}
              class="inline-flex items-center justify-center min-w-8 h-8 px-2 border border-current rounded text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors data-[selected]:bg-black data-[selected]:text-white dark:data-[selected]:bg-white dark:data-[selected]:text-black"
            >
              {p.value}
            </Pagination.Item>
          {:else}
            <Pagination.Ellipsis index={i} class="inline-flex items-center justify-center w-8 h-8 text-sm opacity-40">
              &#8230;
            </Pagination.Ellipsis>
          {/if}
        {/each}
      {/snippet}
    </Pagination.Context>

    <Pagination.NextTrigger
      class="inline-flex items-center justify-center w-8 h-8 border border-current rounded text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      <ChevronRight size={14} />
    </Pagination.NextTrigger>
  </div>
</Pagination.Root>
