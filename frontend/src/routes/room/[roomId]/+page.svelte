<script lang="ts">
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { currentRoom } from '$lib/stores';
  import { getRoom } from '$lib/client';
  import { onMount } from 'svelte';
  import type { Room } from 'shared';

  const roomId = page.params.roomId;
  const userId = browser ? localStorage.getItem('userId') : null;

  let error = '';
  let countdown = 0;
  let isRevealing = false;
  let average: number | null = null;
  let room: Room | null = null;

  $: room = $currentRoom;
  $: isHost = room?.hostId === userId;

  // if (!userId) {
  //   // if no userId, redirect to join page
  //   window.location.href = resolve(`/join/${roomId}`, {});
  // }

  onMount(() => {
    // Fetch room data when component mounts
    getRoom(roomId);
  });

  const cardOptions = [0, 1, 2, 3, 5, 8, 13, 21, 'N/A'];
</script>

<svelte:head>
  <title>Room {roomId} - Planning Poker</title>
</svelte:head>

{#if room}
  <div class="container mx-auto p-4 max-w-6xl">
    <!-- Header -->
    <div class="navbar bg-base-100 rounded-box shadow-lg mb-6">
      <div class="flex-1">
        <a href="/" class="btn btn-ghost text-xl">Planning Poker</a>
        <div class="badge badge-primary ml-2">Room: {roomId}</div>
      </div>
      <div class="flex-none gap-2">
        <button class="btn btn-outline btn-sm"> 📋 Copy Join Link </button>
        <button class="btn btn-ghost btn-sm"> Leave </button>
      </div>
    </div>

    {#if error}
      <div class="alert alert-error mb-4">
        <span>{error}</span>
      </div>
    {/if}

    <!-- Countdown Overlay -->
    {#if isRevealing && countdown > 0}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="text-9xl font-bold text-white animate-pulse">
          {countdown}
        </div>
      </div>
    {/if}

    <!-- Players Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {#each room.users as user}
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center p-4">
            <div class="text-4xl mb-2">{user.icon}</div>
            <h3 class="card-title text-sm">
              {user.name}
              {#if user.isHost}
                <div class="badge badge-warning badge-sm">Host</div>
              {/if}
            </h3>

            <!-- Card Display -->
            <div class="mt-2">
              {#if user?.cardValue}
                {#if room.revealed}
                  <div class="text-4xl font-bold text-primary">
                    {user.cardValue}
                  </div>
                {:else}
                  <div class="text-4xl">🃏</div>
                {/if}
              {:else}
                <div class="text-2xl opacity-30">⏳</div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Average Display -->
    {#if room.revealed && average !== null}
      <div class="alert alert-success mb-6">
        <div class="flex-1">
          <div class="text-center w-full">
            <span class="font-bold text-lg">Average: TODO</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- Card Selection -->
    {#if !room.revealed}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title justify-center mb-4">Select Your Card</h2>
          <div class="flex flex-wrap justify-center gap-3">
            {#each cardOptions as value}
              {@const user = room.users.find((u) => u.id === userId)}
              {@const isSelected = user?.cardValue === value}
              <button class="btn btn-lg {isSelected ? 'btn-primary' : 'btn-outline'} w-16 h-20">
                <span class="text-2xl">{value === null ? '?' : value}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <!-- Host Controls -->
    {#if isHost}
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title justify-center">Host Controls</h2>
          <div class="flex gap-4 justify-center">
            {#if !room.revealed}
              <button class="btn btn-primary btn-lg" disabled={isRevealing}>
                {#if isRevealing}
                  <span class="loading loading-spinner"></span>
                {/if}
                🎭 Reveal Cards
              </button>
            {:else}
              <button class="btn btn-secondary btn-lg"> 🔄 New Round </button>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="flex items-center justify-center min-h-screen">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{/if}
