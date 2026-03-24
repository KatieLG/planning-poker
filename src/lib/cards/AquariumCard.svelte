<script lang="ts">
  import type { User } from '../../../shared/types';
  import CardContent from './CardContent.svelte';
  import FancyBorder from './FancyBorder.svelte';

  let { user, revealed }: { user: User; revealed: boolean } = $props();

  const colors = ['#0ea5e9', '#06b6d4', '#10b981', '#1d4ed8', '#06b6d4', '#0ea5e9'];
  const bg = 'color-mix(in oklab, var(--color-base-100), #0ea5e9 12%)';

  const bubbles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 82}%`,
    size: `${4 + Math.random() * 7}px`,
    duration: `${2.5 + Math.random() * 3}s`,
    delay: `${Math.random() * 4}s`
  }));
</script>

<FancyBorder {colors} {bg} class="card shadow-xl relative overflow-hidden">
  {#each bubbles as b (b.id)}
    <span
      class="bubble"
      style="left:{b.left};width:{b.size};height:{b.size};animation-duration:{b.duration};animation-delay:{b.delay}"
    ></span>
  {/each}

  <div class="card-body items-center text-center p-4 relative z-10">
    <CardContent {user} {revealed} />
  </div>
</FancyBorder>

<style>
  @keyframes float-up {
    0% {
      transform: translateY(0);
      opacity: 0.7;
    }
    100% {
      transform: translateY(-160px);
      opacity: 0;
    }
  }

  .bubble {
    position: absolute;
    bottom: 0;
    border-radius: 50%;
    background: rgba(147, 210, 255, 0.25);
    border: 1px solid rgba(147, 210, 255, 0.5);
    animation: float-up linear infinite;
    pointer-events: none;
  }
</style>
