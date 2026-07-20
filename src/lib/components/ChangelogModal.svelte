<script lang="ts">
  import Info from '$lib/icons/Info.svelte';
  import GitHub from '$lib/icons/GitHub.svelte';
  import { parseChangelog } from '$lib/changelog';
  import changelogMarkdown from '../../../CHANGELOG.md?raw';

  interface Props {
    dialog?: HTMLDialogElement;
  }

  let { dialog = $bindable() }: Props = $props();

  const DISPLAY_COUNT = 3;
  const allEntries = parseChangelog(changelogMarkdown);
  const displayEntries = allEntries.slice(0, DISPLAY_COUNT);
</script>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box pop-in">
    <div class="flex items-center gap-2 mb-5">
      <Info classes="w-6 h-6 opacity-70" />
      <h3 class="font-bold text-xl">What's new</h3>
    </div>

    <div class="flex flex-col gap-5">
      {#each displayEntries as entry (entry.date)}
        <div>
          <p class="text-xs font-medium opacity-40 mb-1.5">
            {new Date(entry.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <ul class="list-disc list-inside flex flex-col gap-1 text-sm">
            {#each entry.items as item (item)}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <div class="flex flex-col gap-2 mt-5 pt-4 border-t border-base-200">
      <a
        class="text-sm opacity-60 hover:opacity-100 transition-opacity w-fit"
        href="https://github.com/KatieLG/planning-poker/blob/main/CHANGELOG.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        See earlier updates &rarr;
      </a>
      <a
        class="flex items-center gap-1.5 text-sm opacity-60 hover:opacity-100 transition-opacity w-fit"
        href="https://github.com/KatieLG/planning-poker"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHub classes="w-4 h-4" />
        Star on GitHub
      </a>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop backdrop-blur-sm bg-black/20">
    <button>close</button>
  </form>
</dialog>
