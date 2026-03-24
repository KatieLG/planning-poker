<script lang="ts">
  import type { User } from '../../../shared/types';
  import CardContent from './CardContent.svelte';
  import FancyBorder from './FancyBorder.svelte';

  let { user, revealed }: { user: User; revealed: boolean } = $props();

  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'red'];
</script>

<FancyBorder {colors} class="card shadow-xl">
  <div class="card-body items-center text-center p-4">
    <CardContent {user} {revealed} />
  </div>
</FancyBorder>
