<script lang="ts">
  import { onMount } from 'svelte';
  import { settings } from '$lib/settings.svelte';
  import Sun from '$lib/icons/Sun.svelte';
  import Moon from '$lib/icons/Moon.svelte';
  import Cog from '$lib/icons/Cog.svelte';
  import Lightbulb from '$lib/icons/Lightbulb.svelte';
  import Info from '$lib/icons/Info.svelte';
  import SettingsModal from '$lib/components/SettingsModal.svelte';
  import RequestModal from '$lib/components/RequestModal.svelte';
  import ChangelogModal from '$lib/components/ChangelogModal.svelte';

  let dialog = $state<HTMLDialogElement>();
  let requestDialog = $state<HTMLDialogElement>();
  let changelogDialog = $state<HTMLDialogElement>();

  onMount(() => {
    settings.initTheme();
  });
</script>

<svelte:head>
  <script lang="ts">
    // set the theme before page render to stop a flash of the wrong theme
    (function () {
      const toggleTheme = localStorage.getItem('toggleTheme') === 'true';
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const theme = (isDark && toggleTheme) || (!isDark && !toggleTheme) ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
</svelte:head>

<div class="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
  <button class="cursor-pointer" onclick={() => changelogDialog?.showModal()}>
    <Info classes="w-10 h-10" />
  </button>

  <button class="cursor-pointer" onclick={() => requestDialog?.showModal()}>
    <Lightbulb classes="w-10 h-10" />
  </button>

  <button class="cursor-pointer" onclick={() => dialog?.showModal()}>
    <Cog classes="w-10 h-10" />
  </button>

  <label class="swap swap-rotate cursor-pointer">
    <input
      type="checkbox"
      class="theme-controller"
      value={settings.systemDefaultIsDark ? 'light' : 'dark'}
      checked={settings.toggleTheme}
      onchange={(e) => settings.setToggleTheme((e.target as HTMLInputElement).checked)}
    />
    <Sun classes="w-10 h-10 {settings.systemDefaultIsDark ? 'swap-on' : 'swap-off'}" />
    <Moon classes="w-10 h-10 {settings.systemDefaultIsDark ? 'swap-off' : 'swap-on'}" />
  </label>
</div>

<SettingsModal bind:dialog />
<RequestModal bind:dialog={requestDialog} />
<ChangelogModal bind:dialog={changelogDialog} />
