<script lang="ts">
  import type { User } from '../../../shared/types';
  import CardContent from './CardContent.svelte';

  let {
    user,
    revealed
  }: {
    user: User;
    revealed: boolean;
  } = $props();
</script>

<div class="card bg-base-100 shadow-xl rainbow-border">
  <div class="card-body items-center text-center p-4">
    <CardContent {user} {revealed} />
  </div>
</div>
