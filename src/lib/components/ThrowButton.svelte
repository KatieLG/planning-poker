<script lang="ts">
  import Poke from '$lib/icons/Poke.svelte';

  type Props = {
    onThrow: () => void;
  };

  const { onThrow }: Props = $props();
</script>

<button
  class="opacity-60 transition-transform duration-200 hover:scale-125 hover:rotate-12 hover:opacity-100 active:scale-110 active:rotate-12"
  title="Throw emoji"
  onclick={onThrow}
>
  <Poke classes="w-5 h-5" />
</button>
