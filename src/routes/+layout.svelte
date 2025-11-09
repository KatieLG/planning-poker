<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import '../app.css';
  import Toast from '$lib/components/Toast.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-base-200">
  {@render children()}
  <Toast />
</div>
