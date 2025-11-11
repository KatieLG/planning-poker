<script lang="ts">
  import JoinRoom from '$lib/components/JoinRoom.svelte';
  import { page } from '$app/state';

  const roomId = page.params.roomId;
</script>

<JoinRoom {roomId} />
