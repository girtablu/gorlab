<script lang="ts">
    import type { SortOption } from "./filters.js";

    let {
        categories = [],
        authors = [],
        genres = [],
        costs = [],
        category = $bindable("all"),
        author = $bindable("all"),
        genre = $bindable("all"),
        cost = $bindable("all"),
        sort = $bindable<SortOption>("newest"),
        show = true,
        showCost = true,
    }: {
        categories: string[];
        authors: string[];
        genres: string[];
        costs: string[];
        category: string;
        author: string;
        genre: string;
        cost: string;
        sort: SortOption;
        show?: boolean;
        showCost?: boolean;
    } = $props();

    const isDirty = $derived(
        category !== "all" ||
            author !== "all" ||
            genre !== "all" ||
            cost !== "all" ||
            sort !== "newest",
    );

    function clearAll() {
        category = "all";
        author = "all";
        genre = "all";
        cost = "all";
        sort = "newest";
    }
</script>

{#if show}
    <div class="flex flex-wrap gap-2">
        <select class="select flex-1" bind:value={category}>
            <option value="all">Categories</option>
            {#each categories as cat}<option value={cat}>{cat}</option>{/each}
        </select>

        <select class="select flex-1" bind:value={author}>
            <option value="all">Authors</option>
            {#each authors as a}<option value={a}>{a}</option>{/each}
        </select>

        <select class="select flex-1" bind:value={genre}>
            <option value="all">Genres</option>
            {#each genres as g}<option value={g}>{g}</option>{/each}
        </select>

        {#if showCost}
            <select class="select flex-1" bind:value={cost}>
                <option value="all">All Costs</option>
                {#each costs as c}<option value={c}>{c}</option>{/each}
            </select>
        {/if}

        <div class="flex items-center gap-2 ml-auto">
            <label
                for="sort-select"
                class="text-xs opacity-60 whitespace-nowrap">Sort by</label
            >
            <select
                id="sort-select"
                class="select w-auto text-sm"
                bind:value={sort}
            >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A–Z</option>
                <option value="za">Z–A</option>
            </select>
        </div>

        <button
            onclick={clearAll}
            disabled={!isDirty}
            aria-label="Clear filters"
            class="shrink-0 transition-colors {isDirty
                ? 'text-success-500 hover:text-success-400 cursor-pointer'
                : 'text-surface-400 cursor-not-allowed'}"
        >
            {#if isDirty}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20 2H4c-.55 0-1 .45-1 1v2c0 .24.09.48.25.66L10 13.38V21c0 .4.24.77.62.92a.995.995 0 0 0 1.09-.21l2-2A1 1 0 0 0 14 19v-5.62l6.75-7.72c.16-.18.25-.42.25-.66V3c0-.55-.45-1-1-1"/>
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21 3H5a1 1 0 0 0-1 1v2.59c0 .523.213 1.037.583 1.407L10 13.414V21a1 1 0 0 0 1.447.895l4-2c.339-.17.553-.516.553-.895v-5.586l5.417-5.417c.37-.37.583-.884.583-1.407V4a1 1 0 0 0-1-1m-6.707 9.293A1 1 0 0 0 14 13v5.382l-2 1V13a1 1 0 0 0-.293-.707L6 6.59V5h14.001l.002 1.583z"/>
                </svg>
            {/if}
        </button>
    </div>
{/if}
