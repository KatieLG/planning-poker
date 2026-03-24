<script lang="ts">
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
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
          <button class="btn btn-primary btn-lg" onclick={() => goto(resolve('/create', {}))}>
            Create New Room
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
