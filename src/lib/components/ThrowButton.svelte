<script lang="ts">
  import Target from '$lib/icons/Target.svelte';

  type Props = {
    onThrow: () => void;
  };

  const { onThrow }: Props = $props();
</script>

<button
  class="opacity-60 transition-transform duration-200 hover:scale-125 hover:opacity-100 active:scale-110"
  title="Throw emoji"
  onclick={onThrow}
>
  <Target classes="w-5 h-5" />
</button>
