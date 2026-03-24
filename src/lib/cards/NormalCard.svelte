<script lang="ts">
  import type { User } from '../../../shared/types';
  import CardContent from './CardContent.svelte';

  let {
    user,
    revealed,
    isCurrentUser
  }: {
    user: User;
    revealed: boolean;
    isCurrentUser: boolean;
  } = $props();
</script>

<div class="card bg-base-100 shadow-xl {isCurrentUser ? 'border-2 border-primary' : ''}">
  <div class="card-body items-center text-center p-4">
    <CardContent {user} {revealed} />
  </div>
</div>
