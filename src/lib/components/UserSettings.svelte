<script lang="ts">
  import { onMount } from 'svelte';
  import Sun from '$lib/icons/Sun.svelte';
  import Moon from '$lib/icons/Moon.svelte';
  import Cog from '$lib/icons/Cog.svelte';
  import SettingsModal from '$lib/components/SettingsModal.svelte';

  let systemDefaultIsDark = $state(false);
  let toggleTheme = $state(false);
  let isDark = $state(false);
  let dialog = $state<HTMLDialogElement>();

  onMount(() => {
    systemDefaultIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    toggleTheme = localStorage.getItem('toggleTheme') === 'true';
    isDark = (systemDefaultIsDark && !toggleTheme) || (!systemDefaultIsDark && toggleTheme);
  });

  const savePreference = () => {
    const theme =
      (systemDefaultIsDark && toggleTheme) || (!systemDefaultIsDark && !toggleTheme)
        ? 'light'
        : 'dark';
    isDark = theme === 'dark';
    localStorage.setItem('toggleTheme', toggleTheme ? 'true' : 'false');
    document.documentElement.setAttribute('data-theme', theme);
  };

  const setDark = (val: boolean) => {
    toggleTheme = val !== systemDefaultIsDark;
    savePreference();
  };
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
  <button onclick={() => dialog?.showModal()}>
    <Cog classes="w-10 h-10" />
  </button>

  <label class="swap swap-rotate">
    <input
      type="checkbox"
      class="theme-controller"
      value={systemDefaultIsDark ? 'light' : 'dark'}
      bind:checked={toggleTheme}
      onchange={savePreference}
    />
    <Sun classes="w-10 h-10 {systemDefaultIsDark ? 'swap-on' : 'swap-off'}" />
    <Moon classes="w-10 h-10 {systemDefaultIsDark ? 'swap-off' : 'swap-on'}" />
  </label>
</div>

<SettingsModal bind:dialog {isDark} {setDark} />
