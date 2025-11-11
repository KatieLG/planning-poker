<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import '../app.css';
  import Toast from '$lib/components/Toast.svelte';
  import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-base-200 relative">
  {@render children()}
  <ThemeSwitch />
  <Toast />
</div>
