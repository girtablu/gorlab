<script lang="ts">
    import "../app.css";
    import { base } from "$app/paths";
    import { config } from "$lib/catalog.js";
    import SearchInput from "$lib/SearchInput.svelte";

    const { children } = $props();

    let dark = $state(false);

    $effect(() => {
        document.body.setAttribute("data-theme", config.theme);
        return () => document.body.removeAttribute("data-theme");
    });

    $effect(() => {
        dark = document.documentElement.classList.contains("dark");
    });

    function toggleDark() {
        dark = !dark;
        document.documentElement.classList.toggle("dark", dark);
        localStorage.setItem("color-scheme", dark ? "dark" : "light");
    }
</script>

<svelte:head>
    <link rel="alternate" type="application/rss+xml" title={config.title} href="{base}/feed.xml" />
    {#if config.customCss}
    <link rel="stylesheet" href="{base}{config.customCss}" />
    {/if}
</svelte:head>

<div data-theme={config.theme} class="min-h-screen flex flex-col">
    <header
        class="border-b border-surface-200-800 px-4 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-4"
    >
        <a
            href="{base}/"
            class="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity justify-self-start"
        >
            {config.title}
        </a>
        <div class="w-full max-w-sm">
            <SearchInput />
        </div>
        <div class="justify-self-end flex items-center gap-3">
            {#if config.showSubmitForm}
                <a
                    href="{base}/submit/"
                    class="text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                    Submit
                </a>
            {/if}
            <button
                onclick={toggleDark}
                class="btn-icon preset-tonal size-8"
                aria-label="Toggle dark mode"
            >
                {#if dark}
                    <svg
                        class="size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="12" r="4" /><path
                            stroke-linecap="round"
                            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                        />
                    </svg>
                {:else}
                    <svg
                        class="size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                        />
                    </svg>
                {/if}
            </button>
        </div>
    </header>

    <main class="flex-1">
        {@render children()}
    </main>

    <footer
        class="border-t border-surface-200-800 px-4 py-3 text-xs opacity-40 text-center flex flex-wrap justify-center gap-x-4 gap-y-1"
    >
        {#if config.siteUrl}
            <a href={config.siteUrl} class="hover:opacity-80" target="_blank" rel="noopener">{config.title}</a>
        {:else}
            <span>{config.title}</span>
        {/if}
        {#if __COMMIT_URL__}
            <a href={__COMMIT_URL__} class="hover:opacity-80" target="_blank" rel="noopener">#{__COMMIT_SHA__}</a>
        {:else}
            <span>#{__COMMIT_SHA__}</span>
        {/if}
        <a
            href="https://opensource.org/licenses/MIT"
            class="hover:opacity-80"
            target="_blank"
            rel="noopener">MIT License</a
        >
        <a href="{base}/feed.xml" class="hover:opacity-80">RSS Feed</a>
    </footer>
</div>
