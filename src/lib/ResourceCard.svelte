<script lang="ts">
  import type { Post } from '../App.svelte'

  let { post }: { post: Post } = $props()

  function toArray(val: string | string[] | null | undefined): string[] {
    if (!val) return []
    return Array.isArray(val) ? val : [val]
  }

  function hashString(s: string): number {
    let h = 0
    for (let i = 0; i < s.length; i++) {
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
    }
    return Math.abs(h)
  }

  function placeholderGradient(name: string): string {
    const h = hashString(name)
    const hue1 = h % 360
    const hue2 = (h + 137) % 360
    return `linear-gradient(135deg, hsl(${hue1} 25% 18%), hsl(${hue2} 25% 28%))`
  }

  const categories = $derived(toArray(post.category))
  const author = $derived(toArray(post.author).join(', '))
  const hasCover = $derived(Boolean(post['cover-image']))
  const coverStyle = $derived(
    hasCover ? '' : `background: ${placeholderGradient(post.name ?? post.slug)};`
  )
</script>

<article class="flex flex-col border border-current rounded overflow-hidden hover:shadow-lg transition-shadow">

  <!-- Cover image or gradient placeholder -->
  <a href={post.url} class="block aspect-[4/3] overflow-hidden flex-shrink-0">
    {#if hasCover}
      <img
        src={post['cover-image']}
        alt={post.name}
        class="w-full h-full object-cover"
        loading="lazy"
      />
    {:else}
      <div class="w-full h-full" style={coverStyle}></div>
    {/if}
  </a>

  <!-- Card body -->
  <div class="flex flex-col flex-1 p-4 gap-2">

    <h2 class="font-bold text-base leading-snug">
      <a href={post.url} class="hover:underline">{post.name}</a>
    </h2>

    {#if post.summary}
    <p class="text-sm opacity-70 line-clamp-3">{post.summary}</p>
    {/if}

    <div class="mt-auto pt-2 flex flex-col gap-1">
      {#if author}
      <span class="text-xs opacity-60">{author}</span>
      {/if}

      <div class="flex flex-wrap gap-1 items-center">
        {#each categories as cat}
        <span class="text-xs border border-current px-2 py-0.5 rounded-full">{cat}</span>
        {/each}

        {#if post.cost}
        <span class="text-xs ml-auto opacity-60">{post.cost}</span>
        {/if}
      </div>
    </div>

  </div>
</article>
