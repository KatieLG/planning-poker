<script lang="ts">
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { appState } from '$lib/stores.svelte';
  import { getRoom, vote, revealCards, resetRoom } from '$lib/client';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { pubsub } from '$lib/pubsub';

  const roomId = page.params.roomId;
  const userId = browser ? localStorage.getItem('userId') : null;

  const cardOptions = [0, 1, 2, 3, 5, 8, 13, 21, null];

  let average: number | null = $state(null);
  let error = $state<string | null>(null);
  let room = $derived(appState.currentRoom);
  let isHost = $derived(room?.hostId === userId);

  $effect(() => {
    return pubsub.on('error', (message: string | null) => {
      if (message) error = message;
    });
  });

  $effect(() => {
    if (room?.revealed) {
      const votes = room.users.map((u) => u.cardValue).filter((v) => v !== null && v !== undefined);
      if (votes.length) {
        average = votes.reduce((sum, v) => sum + v, 0) / votes.length;
      }
    } else {
      average = null;
    }
  });

  onMount(() => {
    // redirect to join if no userid, otherwise fetch room data on load
    if (!userId) {
      goto(resolve(`/join/${roomId}`, {}));
    }
    getRoom(roomId);
  });

  const copyRoomLink = () => {
    if (browser) {
      const joinLink = `${window.location.origin}/join/${roomId}`;
      navigator.clipboard.writeText(joinLink);
      alert('Join link copied to clipboard!');
    }
  };
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
        <button class="btn btn-outline btn-sm" onclick={copyRoomLink}> 📋 Copy Join Link </button>
        <button class="btn btn-ghost btn-sm"> Leave </button>
      </div>
    </div>

    {#if error}
      <div class="alert alert-error mb-4">
        <span>{error}</span>
      </div>
    {/if}

    <!-- Players Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {#each room.users as user}
        {@const isCurrentUser = user.id === userId}
        <div class="card bg-base-100 shadow-xl {isCurrentUser ? 'border-2 border-primary' : ''}">
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
              {#if user?.cardValue !== undefined}
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
            <span class="font-bold text-lg">Average: {average}</span>
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
              <button
                class="btn btn-lg {isSelected ? 'btn-primary' : 'btn-outline'} w-16 h-20"
                onclick={() => vote(value)}
              >
                <span class="text-2xl">{value}</span>
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
              <button class="btn btn-primary btn-lg" onclick={revealCards}>
                🎭 Reveal Cards
              </button>
            {:else}
              <button class="btn btn-secondary btn-lg" onclick={resetRoom}> 🔄 New Round </button>
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
