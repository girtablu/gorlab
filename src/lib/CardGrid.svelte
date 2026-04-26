<script lang="ts">
  import type { Post } from '../App.svelte'
  import ResourceCard from './ResourceCard.svelte'

  let { posts }: { posts: Post[] } = $props()
</script>

{#if posts.length === 0}
  <div class="flex items-center justify-center min-h-48 border border-current border-dashed rounded">
    <p class="opacity-40 text-sm">No resources match your filters.</p>
  </div>
{:else}
  <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each posts as post (post.slug)}
      <li>
        <ResourceCard {post} />
      </li>
    {/each}
  </ul>
{/if}
