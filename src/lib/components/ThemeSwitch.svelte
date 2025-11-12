<script lang="ts">
  import { onMount } from 'svelte';
  import Sun from '$lib/icons/Sun.svelte';
  import Moon from '$lib/icons/Moon.svelte';

  // By default the app uses the system preference for theme
  // this needs to provide a toggle to light mode if the default is dark, else a toggle to dark

  let systemDefaultIsDark = $state(false);
  let toggleTheme = $state(false);

  const getSystemIsDark = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  onMount(() => {
    systemDefaultIsDark = getSystemIsDark();
    toggleTheme = localStorage.getItem('toggleTheme') === 'true';
    console.log(toggleTheme)
  });

  const savePreference = () => {
    localStorage.setItem('toggleTheme', toggleTheme ? 'true' : 'false');
  };
</script>

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
