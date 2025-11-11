<script lang="ts">
  import { onMount } from 'svelte';
  import Sun from '$lib/icons/Sun.svelte';
  import Moon from '$lib/icons/Moon.svelte';

  let darkMode = $state(true);

  onMount(() => {
    darkMode = localStorage.getItem('darkMode') === 'true';
  });

  $effect(() => {
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  });
</script>

<div class="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
  <label class="swap swap-rotate">
    <input type="checkbox" class="theme-controller" value="light" bind:checked={darkMode} />

    <Sun classes="w-10 h-10" />
    <Moon classes="w-10 h-10" />
  </label>
</div>
