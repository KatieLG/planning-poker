<script lang="ts">
  import type { User } from '../../../shared/types';

  let {
    user,
    revealed,
    nullCardIcon,
    nameClass = '',
    valueClass = 'text-primary'
  }: {
    user: User;
    revealed: boolean;
    nullCardIcon: string;
    nameClass?: string;
    valueClass?: string;
  } = $props();
</script>

<div class="text-4xl mb-2">{user.icon}</div>
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
