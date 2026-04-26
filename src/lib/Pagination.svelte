<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte'
  import { Pagination } from '@skeletonlabs/skeleton-svelte'

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

<Pagination {count} {pageSize} {page} onPageChange={(e) => { page = e.page }}>
  <Pagination.PrevTrigger class="btn-icon preset-outlined">
    <ChevronLeft size={14} />
  </Pagination.PrevTrigger>

  <Pagination.Context>
    {#snippet children(pagination)}
      {#each pagination().pages as p, i (i)}
        {#if p.type === 'page'}
          <Pagination.Item {...p} class="btn-icon {p.value === page ? 'preset-filled' : 'preset-outlined'}">
            {p.value}
          </Pagination.Item>
        {:else}
          <Pagination.Ellipsis index={i} class="btn-icon opacity-40">&#8230;</Pagination.Ellipsis>
        {/if}
      {/each}
    {/snippet}
  </Pagination.Context>

  <Pagination.NextTrigger class="btn-icon preset-outlined">
    <ChevronRight size={14} />
  </Pagination.NextTrigger>
</Pagination>
