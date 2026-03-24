<script lang="ts">
  import { onMount } from 'svelte';
  import type { User } from '../../../shared/types';

  let {
    user,
    revealed,
    nullCardIcon
  }: {
    user: User;
    revealed: boolean;
    nullCardIcon: string;
  } = $props();

  type Vein = { id: number; top: string; left: string; size: string };

  let veins = $state<Vein[]>([]);
  let nextId = 0;

  onMount(() => {
    const spawn = () => {
      const id = nextId++;
      veins.push({ id, top: `${5 + Math.random() * 75}%`, left: `${5 + Math.random() * 75}%`, size: `${0.8 + Math.random() * 0.6}rem` });
      setTimeout(() => { veins = veins.filter((v) => v.id !== id); }, 600);
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

<div class="card bg-base-100 shadow-xl rage-border relative overflow-hidden">
  {#each veins as v (v.id)}
    <span class="vein" style="top:{v.top};left:{v.left};font-size:{v.size}">💢</span>
  {/each}

  <div class="card-body items-center text-center p-4 relative z-10">
    <div class="text-4xl mb-2">{user.icon}</div>
    <h3 class="card-title text-sm font-black tracking-widest">
      {user.name}
      {#if user.isHost}
        <div class="badge badge-warning badge-sm">Host</div>
      {/if}
    </h3>

    <div class="mt-2">
      {#if user?.cardValue !== undefined}
        {#if revealed}
          {#key revealed}
            <div class="text-4xl font-black text-error slam">
              {user.cardValue !== null ? user.cardValue : nullCardIcon}
            </div>
          {/key}
        {:else}
          <div class="text-4xl">🃏</div>
        {/if}
      {:else}
        <div class="text-2xl opacity-30">⏳</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .rage-border {
    border: 3px solid transparent;
    background-image:
      linear-gradient(var(--color-base-100), var(--color-base-100)),
      linear-gradient(90deg, #dc2626, #f87171, #dc2626, #991b1b, #dc2626);
    background-clip: padding-box, border-box;
    background-size: 300%;
    animation:
      rage-border-spin 1s linear infinite,
      shake 0.3s infinite;
  }

  @keyframes rage-border-spin {
    to {
      background-position:
        0 0,
        300% 0;
    }
  }

  @keyframes shake {
    0%, 100% { transform: translate(0, 0); }
    20%       { transform: translate(-2px, 1px); }
    40%       { transform: translate(2px, -1px); }
    60%       { transform: translate(-1px, 2px); }
    80%       { transform: translate(1px, -2px); }
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

  @keyframes slam {
    0% {
      transform: scale(4);
      opacity: 0;
    }
    70% {
      transform: scale(0.9);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }

  .vein {
    position: absolute;
    pointer-events: none;
    animation: vein-pop 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }

  .slam {
    animation: slam 0.25s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  }
</style>
