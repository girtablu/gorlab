<script lang="ts">
  let { value = $bindable('') }: { value: string } = $props()
</script>

<div class="relative w-full max-w-md">
  <label for="jekyll-ttrpg-catalog-search" class="sr-only">Search resources</label>
  <input
    id="jekyll-ttrpg-catalog-search"
    type="search"
    bind:value
    placeholder="Search resources…"
    class="w-full border border-current bg-transparent px-4 py-2 pr-10 text-sm rounded focus:outline-none focus:ring-1 focus:ring-current placeholder:opacity-40"
  />
  <!-- Search icon -->
  <svg
    class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path stroke-linecap="round" d="m21 21-4.35-4.35" />
  </svg>
</div>
