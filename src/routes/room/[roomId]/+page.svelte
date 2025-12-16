<script lang="ts">
  import { page } from '$app/state';
  import { browser } from '$app/environment';
  import { appState } from '$lib/stores.svelte';
  import { vote, revealCards, resetRoom, joinRoom, leaveRoom, checkRoom } from '$lib/client';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { pubsub } from '$lib/pubsub';
  import { onMount } from 'svelte';

  const roomId = page.params.roomId;

  const username = browser ? localStorage.getItem('username') : null;
  const userIcon = browser ? localStorage.getItem('userIcon') : null;

  const cardOptions = [0, 1, 2, 3, 5, 8, 13, 21, null];
  const nullCardIcon = '🦞';

  let average: number | null = $state(null);
  let error = $state<string | null>(null);
  let room = $derived(appState.currentRoom);
  let userId = $derived(appState.currentUserId);
  let isHost = $derived(room?.hostId === userId);

  $effect(() => {
    return pubsub.on('error', (message: string | null) => {
      if (message) error = message;
    });
  });

  $effect(() => {
    return pubsub.on('roomNotFound', (notFoundRoomId: string) => {
      if (notFoundRoomId === roomId) {
        pubsub.emit('toast', {
          type: 'error',
          message: 'This room no longer exists'
        });
        goto(resolve('/', {}));
      }
    });
  });

  $effect(() => {
    return pubsub.on('roomFound', (foundRoomId: string) => {
      if (foundRoomId === roomId) {
        // Room exists, try to join
        if (username && userIcon) {
          joinRoom({ roomId: roomId, name: username, icon: userIcon });
        }
      }
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
    if (!userId || !room) {
      if (!username || !userIcon) {
        // missing name or icon, so go back to join page
        goto(resolve(`/join/${roomId}`, {}));
        return;
      }
      // Check if room exists first before trying to rejoin
      checkRoom(roomId);
    }
  });

  const copyRoomLink = () => {
    if (browser) {
      const joinLink = `${window.location.origin}/join/${roomId}`;
      navigator.clipboard.writeText(joinLink);
      pubsub.emit('toast', {
        type: 'success',
        message: 'Join link copied to clipboard!'
      });
    }
  };

  const leave = () => {
    leaveRoom();
    goto(resolve('/', {}));
  };
</script>

<svelte:head>
  <title>Room {roomId} - Planning Poker</title>
</svelte:head>

{#if room}
  <div class="container mx-auto p-4 max-w-6xl">
    <div class="navbar bg-base-100 rounded-box shadow-lg mb-6">
      <div class="flex-1">
        <button class="btn btn-ghost text-xl" onclick={leave}>Planning Poker</button>
        <div class="badge badge-primary ml-2">Room: {roomId}</div>
      </div>
      <div class="flex-none gap-2">
        <button class="btn btn-outline btn-sm" onclick={copyRoomLink}> 📋 Copy Join Link </button>
        <button class="btn btn-ghost btn-sm" onclick={leave}> Leave </button>
      </div>
    </div>

    {#if error}
      <div class="alert alert-error mb-4">
        <span>{error}</span>
      </div>
    {/if}

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {#each room.users as user (user.id)}
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

            <div class="mt-2">
              {#if user?.cardValue !== undefined}
                {#if room.revealed}
                  <div class="text-4xl font-bold text-primary">
                    {user.cardValue !== null ? user.cardValue : nullCardIcon}
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

    {#if room.revealed}
      <div class="alert {average !== null ? 'alert-success' : 'alert-info'} mb-6">
        <div class="flex-1">
          <div class="text-center w-full">
            <span class="font-bold text-lg"
              >{average !== null ? `Average: ${average}` : 'Nobody voted'}</span
            >
          </div>
        </div>
      </div>
    {/if}

    {#if !room.revealed}
      <div class="card bg-base-100 shadow-xl mb-6">
        <div class="card-body">
          <h2 class="card-title justify-center mb-4">Select Your Card</h2>
          <div class="flex flex-wrap justify-center gap-3">
            {#each cardOptions as value (value)}
              {@const user = room.users.find((u) => u.id === userId)}
              {@const isSelected = user?.cardValue === value}
              <button
                class="btn btn-lg {isSelected ? 'btn-primary' : 'btn-outline'} w-16 h-20"
                onclick={() => vote(value)}
              >
                <span class="text-2xl">{value !== null ? value : nullCardIcon}</span>
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}

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
