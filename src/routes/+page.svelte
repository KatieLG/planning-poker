<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { createRoom } from '$lib/client';
  import { pubsub } from '$lib/pubsub';

  let joinRoomId = $state('');
  let error = $state<string | null>(null);

  const joinRoom = () => {
    if (joinRoomId.trim()) {
      goto(resolve(`/join/${joinRoomId.trim()}`, {}));
    } else {
      error = 'Enter a room ID to join.';
    }
  };

  $effect(() => {
    return pubsub.on('error', (message: string | null) => {
      if (message) error = message;
    });
  });

  $effect(() => {
    if (joinRoomId.trim() && error) {
      error = null;
    }
  });
</script>

<svelte:head>
  <title>Planning Poker</title>
</svelte:head>

<div class="hero min-h-screen">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold mb-8">Planning Poker</h1>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title justify-center mb-4">Get Started</h2>

          {#if error}
            <div class="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          {/if}

          <button class="btn btn-primary btn-lg mb-4" onclick={createRoom}>
            Create New Room
          </button>

          <div class="divider">OR</div>

          <div class="form-control">
            <label class="label" for="roomId">
              <span class="label-text pr-1">Enter Room ID</span>
            </label>
            <div class="join">
              <input
                id="roomId"
                type="text"
                placeholder="Room ID"
                class="input input-bordered join-item flex-1"
                bind:value={joinRoomId}
                onkeypress={(e) => e.key === 'Enter' && joinRoom()}
              />
              <button class="btn btn-secondary join-item" onclick={joinRoom}> Join </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
