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
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M12 3C8.5 3 5.5 6.5 5.5 12c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5C18.5 6.5 15.5 3 12 3Z"
  />
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M6 11.5 8.5 10l2.5 1.5 2.5-1.5 2.5 1.5L18 10"
  />
</svg>
