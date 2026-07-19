<script lang="ts">
  import Info from '$lib/icons/Info.svelte';
  import GitHub from '$lib/icons/GitHub.svelte';
  import { parseChangelog } from '$lib/changelog';
  import changelogMarkdown from '../../../CHANGELOG.md?raw';

  interface Props {
    dialog?: HTMLDialogElement;
  }

  let { dialog = $bindable() }: Props = $props();

  const ENTRIES = parseChangelog(changelogMarkdown);
</script>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box pop-in">
    <div class="flex items-center gap-2 mb-5">
      <Info classes="w-6 h-6 opacity-70" />
      <h3 class="font-bold text-xl">What's new</h3>
    </div>

    <div class="flex flex-col gap-5">
      {#each ENTRIES as entry (entry.date)}
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

    <a
      class="flex items-center gap-1.5 mt-5 pt-4 border-t border-base-200 text-sm opacity-60 hover:opacity-100 transition-opacity w-fit"
      href="https://github.com/KatieLG/planning-poker"
      target="_blank"
      rel="noopener noreferrer"
    >
      <GitHub classes="w-4 h-4" />
      View source on GitHub
    </a>
  </div>

  <form method="dialog" class="modal-backdrop backdrop-blur-sm bg-black/20">
    <button>close</button>
  </form>
</dialog>

<style>
  @keyframes pop-in {
    0% {
      transform: scale(0.95);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  .pop-in {
    animation: pop-in 0.15s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }
</style>
