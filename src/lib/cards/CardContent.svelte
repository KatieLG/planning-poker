<script lang="ts">
  import type { User } from '../../../shared/types';
  import ThrowButton from '../components/ThrowButton.svelte';
  import { throwEmoji } from '$lib/client';

  let {
    user,
    revealed,
    throwingEnabled,
    nameClass = '',
    valueClass = 'text-primary'
  }: {
    user: User;
    revealed: boolean;
    throwingEnabled: boolean;
    nameClass?: string;
    valueClass?: string;
  } = $props();

  const nullCardIcon = '🦞';

  const handleThrow = () => {
    throwEmoji(user.id);
  };
</script>

<div class="relative w-full">
  <div class="text-4xl mb-2">{user.icon}</div>
  {#if throwingEnabled}
    <div class="absolute top-0 right-0">
      <ThrowButton onThrow={handleThrow} />
    </div>
  {/if}
</div>
<h3 class="card-title text-sm {nameClass}">
  {user.name}
  {#if user.isHost}
    <div class="badge badge-warning badge-sm">Host</div>
  {/if}
</h3>
<div class="mt-2">
  {#if user?.cardValue !== undefined}
    {#if revealed}
      <div class="text-4xl font-bold {valueClass}">
        {user.cardValue !== null ? user.cardValue : nullCardIcon}
      </div>
    {:else}
      <div class="text-4xl">🃏</div>
    {/if}
  {:else}
    <div class="text-2xl opacity-30">⏳</div>
  {/if}
</div>
