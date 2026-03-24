<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    colors,
    bg = 'var(--color-base-100)',
    class: cls = '',
    children
  }: {
    colors: string[];
    bg?: string;
    class?: string;
    children: Snippet;
  } = $props();
</script>

<div class="fancy-border {cls}" style="--fb-bg:{bg};--fb-colors:{colors.join(',')}">
  {@render children()}
</div>

<style>
  .fancy-border {
    border: 3px solid transparent;
    background-image:
      linear-gradient(var(--fb-bg), var(--fb-bg)), linear-gradient(90deg, var(--fb-colors));
    background-clip: padding-box, border-box;
    background-size: 200%;
    animation: fancy-border-spin 2s linear infinite;
  }

  @keyframes fancy-border-spin {
    to {
      background-position:
        0 0,
        200% 0;
    }
  }
</style>
