<script lang="ts">
  import { config } from '$lib/catalog.js'

  type Status = 'idle' | 'submitting' | 'success' | 'error'

  let status = $state<Status>('idle')
  let errorMessage = $state('')
  let categoryError = $state(false)

  const multipleKeys = new Set(
    config.customFields.filter(f => f.multiple).map(f => `fields[${f.key}]`)
  )

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const rawData = new FormData(form)

    // Validate at least one category is checked
    const categories = rawData.getAll('fields[category][]')
    if (categories.length === 0) {
      categoryError = true
      return
    }
    categoryError = false
    status = 'submitting'

    // Build final FormData, splitting comma-separated multiple fields into arrays
    const submitData = new FormData()
    for (const [key, value] of rawData.entries()) {
      if (!multipleKeys.has(key)) {
        submitData.append(key, value)
      }
    }
    for (const field of config.customFields) {
      if (field.multiple) {
        const raw = rawData.get(`fields[${field.key}]`) as string | null
        if (raw) {
          raw.split(',').map(v => v.trim()).filter(Boolean).forEach(v => {
            submitData.append(`fields[${field.key}][]`, v)
          })
        }
      }
    }

    try {
      const res = await fetch(config.staticmanUrl, { method: 'POST', body: submitData })
      if (res.ok) {
        status = 'success'
        form.reset()
      } else {
        status = 'error'
        errorMessage = `Submission failed (${res.status}). Please try again.`
      }
    } catch {
      status = 'error'
      errorMessage = 'Network error. Please check your connection and try again.'
    }
  }
</script>

<div class="px-4 py-12 max-w-2xl mx-auto">
  {#if !config.showSubmitForm}
    <h1 class="h2 mb-2">Submissions Closed</h1>
    <p class="opacity-60">This catalog is not currently accepting community submissions.</p>

  {:else if !config.staticmanUrl}
    <h1 class="h2 mb-2">Submit a Resource</h1>
    <p class="opacity-60">The submission form has not been configured yet.</p>
    <p class="text-sm opacity-40 mt-2 italic">
      Set <code>staticmanUrl</code> in <code>catalog.config.js</code> to enable submissions.
    </p>

  {:else if status === 'success'}
    <div data-testid="form-success" class="card p-8 text-center flex flex-col gap-4">
      <h1 class="h2">Thank you!</h1>
      <p class="opacity-70">Your submission is under review. It will appear in the catalog once approved.</p>
      <button onclick={() => { status = 'idle' }} class="btn preset-tonal mx-auto">
        Submit another
      </button>
    </div>

  {:else}
    <h1 class="h2 mb-2">Submit a Resource</h1>
    <p class="opacity-60 mb-8">
      Suggest a resource to add to the catalog. Submissions are reviewed before publishing.
    </p>

    <form onsubmit={handleSubmit} class="flex flex-col gap-6" novalidate>

      <!-- Name -->
      <label class="label">
        <span class="label-text">Title <span class="text-error-500">*</span></span>
        <input
          name="fields[name]"
          type="text"
          class="input"
          placeholder="Name of the resource"
          required
        />
      </label>

      <!-- Author -->
      <label class="label">
        <span class="label-text">Author</span>
        <input
          name="fields[author]"
          type="text"
          class="input"
          placeholder="Author or creator name"
        />
      </label>

      <!-- Source -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label class="label">
          <span class="label-text">Source</span>
          <input
            name="fields[source]"
            type="text"
            class="input"
            placeholder="e.g. itch.io, DriveThruRPG"
          />
        </label>
        <label class="label">
          <span class="label-text">Source URL</span>
          <input
            name="fields[source-url]"
            type="url"
            class="input"
            placeholder="https://..."
          />
        </label>
      </div>

      <!-- Category -->
      <fieldset>
        <legend class="label-text mb-2">
          Category <span class="text-error-500">*</span>
        </legend>
        {#if categoryError}
          <p class="text-error-500 text-sm mb-1" role="alert">Please select at least one category.</p>
        {/if}
        <div class="flex flex-wrap gap-x-4 gap-y-2">
          {#each config.categories as cat}
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="fields[category][]"
                value={cat}
                class="checkbox"
                onchange={() => { if (categoryError) categoryError = false }}
              />
              <span class="text-sm">{cat}</span>
            </label>
          {/each}
        </div>
      </fieldset>

      <!-- Genre + Cost -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label class="label">
          <span class="label-text">Genre</span>
          <input
            name="fields[genre]"
            type="text"
            class="input"
            placeholder="e.g. horror, fantasy, sci-fi"
          />
        </label>
        <label class="label">
          <span class="label-text">Cost</span>
          <input
            name="fields[cost]"
            type="text"
            class="input"
            placeholder="e.g. free, PWYW, $10"
          />
        </label>
      </div>

      <!-- Summary -->
      <label class="label">
        <span class="label-text">Summary <span class="text-error-500">*</span></span>
        <textarea
          name="fields[summary]"
          class="textarea"
          rows="4"
          placeholder="Brief description of the resource"
          required
        ></textarea>
      </label>

      <!-- Cover Image + License -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label class="label">
          <span class="label-text">Cover Image URL</span>
          <input
            name="fields[cover-image]"
            type="url"
            class="input"
            placeholder="https://..."
          />
        </label>
        <label class="label">
          <span class="label-text">License</span>
          <input
            name="fields[license]"
            type="text"
            class="input"
            placeholder="e.g. CC BY 4.0, All Rights Reserved"
          />
        </label>
      </div>

      <!-- Tags -->
      <label class="label">
        <span class="label-text">Tags</span>
        <input
          name="fields[tags]"
          type="text"
          class="input"
          placeholder="Comma-separated: osr, one-shot, dungeon"
        />
        <p class="text-xs opacity-50 mt-1">Separate multiple tags with commas.</p>
      </label>

      <!-- Custom fields from catalog.config.js -->
      {#each config.customFields as field}
        <label class="label">
          <span class="label-text">{field.label}</span>
          {#if field.type === 'date'}
            <input name="fields[{field.key}]" type="date" class="input" />
          {:else if field.type === 'url'}
            <input name="fields[{field.key}]" type="url" class="input" placeholder="https://..." />
          {:else}
            <input
              name="fields[{field.key}]"
              type="text"
              class="input"
              placeholder={field.multiple ? 'Separate multiple values with commas' : ''}
            />
          {/if}
          {#if field.multiple}
            <p class="text-xs opacity-50 mt-1">Separate multiple values with commas.</p>
          {/if}
        </label>
      {/each}

      {#if status === 'error'}
        <p class="text-error-500 text-sm" role="alert" data-testid="form-error">{errorMessage}</p>
      {/if}

      <div class="flex items-center gap-4 pt-2">
        <button
          type="submit"
          class="btn preset-filled"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit Resource'}
        </button>
        <p class="text-xs opacity-40">Fields marked <span class="text-error-500">*</span> are required.</p>
      </div>

    </form>
  {/if}
</div>
