<script lang="ts">
  import type { User } from '../../../shared/types';
  import CardContent from './CardContent.svelte';

  let {
    user,
    isCurrentUser,
    revealed,
    throwingEnabled
  }: {
    user: User;
    isCurrentUser: boolean;
    revealed: boolean;
    throwingEnabled: boolean;
  } = $props();
</script>

<div class="card bg-base-100 shadow-xl {isCurrentUser ? 'border-2 border-primary' : ''}">
  <div class="card-body items-center text-center p-4">
    <CardContent {user} {revealed} {throwingEnabled} />
  </div>
</div>
