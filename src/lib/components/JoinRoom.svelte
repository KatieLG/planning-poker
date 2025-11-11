<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { joinRoom, createRoom } from '$lib/client';
  import { pubsub } from '$lib/pubsub';

  type Props = {
    roomId?: string;
  };

  const { roomId } = $props<Props>();

  let name = $state('');
  let selectedIcon = $state('');
  let error = $state<string | null>('');
  let isLoading = false;

  const icons = [
    '😎',
    '🤓',
    '🤠',
    '🦞',
    '🦐',
    '🔥',
    '🐸',
    '👑',
    '🐼',
    '⭐',
    '👻',
    '🤖',
    '🙀',
    '🌈',
    '🌵',
    '✈️',
    '🚀',
    '💩'
  ];

  $effect(() => {
    if (name.trim() && selectedIcon) error = '';
  });

  $effect(() => {
    return pubsub.on('error', (message: string | null) => {
      if (message) error = message;
    });
  });

  const joinOrCreate = () => {
    if (!name.trim() || !selectedIcon) {
      error = 'Please enter your name and select an icon.';
      return;
    }
    localStorage.setItem('username', name.trim());
    localStorage.setItem('userIcon', selectedIcon);

    if (roomId) {
      joinRoom({ roomId: roomId, name: name.trim(), icon: selectedIcon });
    } else {
      createRoom({ name: name.trim(), icon: selectedIcon });
    }
  };
</script>

<svelte:head>
  <title>{roomId ? 'Join' : 'Create'} Room - Planning Poker</title>
</svelte:head>

<div class="hero min-h-screen">
  <div class="hero-content">
    <div class="card bg-base-100 shadow-xl w-full max-w-md">
      <div class="card-body">
        <h2 class="card-title justify-center mb-4">{roomId ? 'Join' : 'Create'} Room</h2>
        {#if roomId}
          <p class="text-center mb-4">Room ID: <span class="font-mono font-bold">{roomId}</span></p>
        {/if}

        {#if error}
          <div class="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        {/if}

        <div class="form-control mb-4">
          <label class="label" for="name">
            <span class="label-text pr-1">Your Name</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            class="input input-bordered"
            bind:value={name}
            onkeypress={(e) => e.key === 'Enter' && join()}
          />
        </div>

        <div class="form-control mb-6">
          <label class="label" for="icon-select">
            <span class="label-text pb-1">Choose Your Icon</span>
          </label>
          <div class="grid grid-cols-6 gap-2" id="icon-select" role="radiogroup">
            {#each icons as icon (icon)}
              <button
                class="btn btn-lg {selectedIcon === icon ? 'btn-primary' : 'btn-outline'}"
                onclick={() => (selectedIcon = icon)}
              >
                {icon}
              </button>
            {/each}
          </div>
        </div>

        <button class="btn btn-primary btn-block" onclick={joinOrCreate} disabled={isLoading}>
          {#if isLoading}
            <span class="loading loading-spinner"></span>
          {/if}
          {roomId ? 'Join' : 'Create'} Room
        </button>

        <button class="btn btn-ghost btn-sm mt-2" onclick={() => goto(resolve('/', {}))}>
          Back to Home
        </button>
      </div>
    </div>
  </div>
</div>
