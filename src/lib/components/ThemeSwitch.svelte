<script lang="ts">
  import { onMount } from 'svelte';
  import Sun from '$lib/icons/Sun.svelte';
  import Moon from '$lib/icons/Moon.svelte';

  // By default the app uses the system preference for theme
  // this needs to provide a toggle to light mode if the default is dark, else a toggle to dark

  let systemDefaultIsDark = $state(false);
  let toggleTheme = $state(false);

  onMount(() => {
    systemDefaultIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    toggleTheme = localStorage.getItem('toggleTheme') === 'true';
    console.log(toggleTheme);
  });

  const savePreference = () => {
    const theme =
      (systemDefaultIsDark && toggleTheme) || (!systemDefaultIsDark && !toggleTheme)
        ? 'light'
        : 'dark';
    localStorage.setItem('toggleTheme', toggleTheme ? 'true' : 'false');
    document.documentElement.setAttribute('data-theme', theme);
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
