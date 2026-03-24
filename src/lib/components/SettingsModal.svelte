<script lang="ts">
  import { settings } from '$lib/settings.svelte';
  import Cog from '$lib/icons/Cog.svelte';
  import Moon from '$lib/icons/Moon.svelte';
  import Egg from '$lib/icons/Egg.svelte';

  interface Props {
    dialog?: HTMLDialogElement;
    isDark: boolean;
    setDark: (val: boolean) => void;
  }

  let { dialog = $bindable(), isDark, setDark }: Props = $props();
</script>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box pop-in">
    <div class="flex items-center gap-2 mb-5">
      <Cog classes="w-6 h-6 opacity-70" />
      <h3 class="font-black text-xl tracking-wide">Settings</h3>
    </div>

    <div class="flex flex-col gap-1">
      <label
        class="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-base-200 cursor-pointer transition-colors"
      >
        <div class="flex items-center gap-3">
          <Moon classes="w-5 h-5 opacity-70" />
          <span class="text-base">Dark Mode</span>
        </div>
        <input
          type="checkbox"
          class="toggle toggle-primary"
          checked={isDark}
          onchange={(e) => setDark((e.target as HTMLInputElement).checked)}
        />
      </label>

      <label
        class="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-base-200 cursor-pointer transition-colors"
      >
        <div class="flex items-center gap-3">
          <Egg classes="w-5 h-5 opacity-70" />
          <div class="flex flex-col">
            <span class="text-base">Easter Eggs</span>
            {#if settings.easterEggsEnabled}
              <span class="text-xs opacity-50">Happy hunting 🐰</span>
            {/if}
          </div>
        </div>
        <input
          type="checkbox"
          class="toggle toggle-warning"
          checked={settings.easterEggsEnabled}
          onchange={(e) => settings.setEasterEggs((e.target as HTMLInputElement).checked)}
        />
      </label>
    </div>
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
