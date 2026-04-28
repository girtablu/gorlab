<script lang="ts">
  import { goto } from '$app/navigation'
  import { base } from '$app/paths'

  let query = $state('')

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (query.trim()) {
      goto(`${base}/search/?q=${encodeURIComponent(query.trim())}`)
    }
  }
</script>

<form onsubmit={handleSubmit} class="input-group grid-cols-[1fr_auto] w-full">
  <input
    type="search"
    bind:value={query}
    placeholder="Search resources…"
    class="ig-input"
    aria-label="Search resources"
  />
  <button type="submit" class="ig-cell preset-tonal" aria-label="Submit search">
    <svg class="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path stroke-linecap="round" d="m21 21-4.35-4.35" />
    </svg>
  </button>
</form>
