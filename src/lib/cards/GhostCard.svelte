<script lang="ts">
  import type { User } from '../../../shared/types';
  import CardContent from './CardContent.svelte';
  import FancyBorder from './FancyBorder.svelte';

  let { user, revealed }: { user: User; revealed: boolean } = $props();

  const colors = ['#ffffff', '#b0b0c8', '#e8e8f4', '#7a7a9a', '#d0d0e8', '#9090b8', '#ffffff'];
  const bg = 'color-mix(in oklab, var(--color-base-100), #e0e0f0 15%)';
</script>

<div class="ghost-wrap">
  <FancyBorder {colors} {bg} class="card shadow-xl">
    <div class="card-body items-center text-center p-4">
      <CardContent {user} {revealed} />
    </div>
  </FancyBorder>
</div>

<style>
  @keyframes ghost-pulse {
    0% {
      opacity: 1;
    }
    40% {
      opacity: 0.35;
    }
    60% {
      opacity: 0.25;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes ghost-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
  .ghost-wrap {
    animation:
      ghost-pulse 3.5s ease-in-out infinite,
      ghost-float 4s ease-in-out infinite;
    filter: saturate(0.2) brightness(1.05);
  }
</style>
