<script lang="ts">
  import { onMount } from 'svelte';
  import type { User } from '../../../shared/types';
  import FancyBorder from './FancyBorder.svelte';
  import CardContent from './CardContent.svelte';

  let { user, revealed }: { user: User; revealed: boolean } = $props();

  const colors = ['#dc2626', '#f87171', '#dc2626', '#991b1b', '#dc2626'];

  type Vein = { id: number; top: string; left: string; size: string };

  let veins = $state<Vein[]>([]);
  let nextId = 0;

  onMount(() => {
    const spawn = () => {
      const id = nextId++;
      veins.push({
        id,
        top: `${5 + Math.random() * 75}%`,
        left: `${5 + Math.random() * 75}%`,
        size: `${0.8 + Math.random() * 0.6}rem`
      });
      setTimeout(() => {
        veins = veins.filter((v) => v.id !== id);
      }, 600);
    };

    const spawnBurst = () => {
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        setTimeout(spawn, i * 80);
      }
    };

    spawnBurst();
    const interval = setInterval(spawnBurst, 800);
    return () => clearInterval(interval);
  });
</script>

<div class="shaker">
  <FancyBorder {colors} class="card bg-base-100 shadow-xl relative overflow-hidden">
    {#each veins as v (v.id)}
      <span class="vein" style="top:{v.top};left:{v.left};font-size:{v.size}">💢</span>
    {/each}

    <div class="card-body items-center text-center p-4 relative z-10">
      <CardContent
        {user}
        {revealed}
        nameClass="font-black tracking-widest"
        valueClass="text-error font-black"
      />
    </div>
  </FancyBorder>
</div>

<style>
  .shaker {
    animation: shake 0.3s infinite;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(-2px, 1px);
    }
    40% {
      transform: translate(2px, -1px);
    }
    60% {
      transform: translate(-1px, 2px);
    }
    80% {
      transform: translate(1px, -2px);
    }
  }

  @keyframes vein-pop {
    0% {
      transform: scale(0) rotate(-30deg);
      opacity: 0;
    }
    60% {
      transform: scale(1.3) rotate(10deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 0;
    }
  }

  .vein {
    position: absolute;
    pointer-events: none;
    animation: vein-pop 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }
</style>
