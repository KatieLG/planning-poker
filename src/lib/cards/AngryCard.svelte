<script lang="ts">
  import type { User } from '../../../shared/types';
  import FancyBorder from './FancyBorder.svelte';
  import CardContent from './CardContent.svelte';

  let { user, revealed }: { user: User; revealed: boolean } = $props();

  const colors = ['#dc2626', '#f87171', '#dc2626', '#991b1b', '#dc2626'];
</script>

<div class="shaker">
  <FancyBorder {colors} class="card bg-base-100 shadow-xl">
    <div class="card-body items-center text-center p-4">
      <CardContent
        {user}
        {revealed}
        nameClass="font-black tracking-widest"
        valueClass="text-error font-black"
      />
    </div>
  </FancyBorder>
</div>

<style>
  .shaker {
    animation: shake 0.3s infinite;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(-2px, 1px);
    }
    40% {
      transform: translate(2px, -1px);
    }
    60% {
      transform: translate(-1px, 2px);
    }
    80% {
      transform: translate(1px, -2px);
    }
  }
</style>
