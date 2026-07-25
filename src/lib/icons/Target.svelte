<script lang="ts">
  type Props = { classes?: string };
  const { classes }: Props = $props();
</script>

<svg
  class={classes}
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  stroke-width="1.5"
>
  <circle cx="12" cy="12" r="8.25" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="12" cy="12" r="4.5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
</svg>
