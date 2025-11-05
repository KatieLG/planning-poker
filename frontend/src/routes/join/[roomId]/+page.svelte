<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  const roomId = page.params.roomId;

  let name = '';
  let selectedIcon = '🤠';
  let error = '';
  let isLoading = false;

  const icons = [
    '😎',
    '🤓',
    '🥳',
    '🤠',
    '🧠',
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

  const join = () => {
    if (!name.trim()) {
      error = 'Please enter your name';
      return;
    }
    console.log(`Joining room ${roomId} as ${name} with icon ${selectedIcon}`);
  };
</script>

<svelte:head>
  <title>Join Room - Planning Poker</title>
</svelte:head>

<div class="hero min-h-screen">
  <div class="hero-content">
    <div class="card bg-base-100 shadow-xl w-full max-w-md">
      <div class="card-body">
        <h2 class="card-title justify-center mb-4">Join Room</h2>
        <p class="text-center mb-4">Room ID: <span class="font-mono font-bold">{roomId}</span></p>

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
            on:keypress={(e) => e.key === 'Enter' && join()}
          />
        </div>

        <div class="form-control mb-6">
          <label class="label" for="icon-select">
            <span class="label-text pb-1">Choose Your Icon</span>
          </label>
          <div class="grid grid-cols-6 gap-2" id="icon-select" role="radiogroup">
            {#each icons as icon}
              <button
                class="btn btn-lg {selectedIcon === icon ? 'btn-primary' : 'btn-outline'}"
                on:click={() => (selectedIcon = icon)}
              >
                {icon}
              </button>
            {/each}
          </div>
        </div>

        <button class="btn btn-primary btn-block" on:click={join} disabled={isLoading}>
          {#if isLoading}
            <span class="loading loading-spinner"></span>
          {/if}
          Join Room
        </button>

        <button class="btn btn-ghost btn-sm mt-2" on:click={() => goto('/')}> Back to Home </button>
      </div>
    </div>
  </div>
</div>
