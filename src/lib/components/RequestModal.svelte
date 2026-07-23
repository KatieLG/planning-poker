<script lang="ts">
  import Lightbulb from '$lib/icons/Lightbulb.svelte';

  interface Props {
    dialog?: HTMLDialogElement;
  }

  let { dialog = $bindable() }: Props = $props();

  const CATEGORIES = ['Feature', 'Bug', 'Easter egg', 'Other'] as const;
  type Category = (typeof CATEGORIES)[number];

  let category = $state<Category>('Feature');
  let message = $state('');
  let submitting = $state(false);
  let submitted = $state(false);
  let error = $state('');

  function reset() {
    category = 'Feature';
    message = '';
    submitting = false;
    submitted = false;
    error = '';
  }

  function close() {
    dialog?.close();
    setTimeout(reset, 200);
  }

  async function submit() {
    if (!message.trim()) return;

    submitting = true;
    error = '';

    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, message: message.trim() })
      });

      if (res.status === 429) {
        error = 'Too many requests — please wait a moment before trying again.';
      } else if (!res.ok) {
        error = 'Something went wrong. Please try again.';
      } else {
        submitted = true;
      }
    } catch {
      error = 'Something went wrong. Please try again.';
    } finally {
      submitting = false;
    }
  }
</script>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box pop-in">
    <div class="flex items-center gap-2 mb-1">
      <Lightbulb classes="w-6 h-6 opacity-70" />
      <h3 class="font-bold text-xl">Request a change</h3>
    </div>
    <p class="text-sm opacity-50 mb-5 ml-8">
      Have an idea, a bug to report, or something else? Drop it here.
    </p>

    {#if submitted}
      <div class="flex flex-col items-center gap-3 py-6 text-center">
        <span class="text-4xl">🎉</span>
        <p class="text-base font-medium">Request submitted!</p>
        <button class="btn btn-primary btn-sm mt-2" onclick={close}>Done</button>
      </div>
    {:else}
      <div class="flex flex-col gap-4">
        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium opacity-70">Category</span>
          <select class="select select-bordered w-full" bind:value={category}>
            {#each CATEGORIES as cat (cat)}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-sm font-medium opacity-70">Message</span>
          <textarea
            class="textarea textarea-bordered w-full resize-none"
            rows="4"
            placeholder="Describe your request..."
            bind:value={message}
          ></textarea>
          <p class="text-xs opacity-40">Please don't include any personal information.</p>
        </label>

        {#if error}
          <p class="text-error text-sm">{error}</p>
        {/if}

        <div class="flex justify-end gap-2 mt-1">
          <button class="btn btn-ghost btn-sm" onclick={close}>Cancel</button>
          <button
            class="btn btn-primary btn-sm"
            onclick={submit}
            disabled={submitting || !message.trim()}
          >
            {submitting ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </div>
    {/if}
  </div>

  <form method="dialog" class="modal-backdrop backdrop-blur-sm bg-black/20">
    <button onclick={reset}>close</button>
  </form>
</dialog>
