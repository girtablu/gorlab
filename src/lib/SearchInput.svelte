<script lang="ts">
  let { value = $bindable('') }: { value: string } = $props()
</script>

<div class="input-group grid-cols-[1fr_auto] w-full max-w-md">
  <input
    id="jekyll-ttrpg-catalog-search"
    type="search"
    bind:value
    placeholder="Search resources…"
    class="ig-input"
    aria-label="Search resources"
  />
  <div class="ig-cell preset-tonal">
    <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path stroke-linecap="round" d="m21 21-4.35-4.35" />
    </svg>
  </div>
</div>
