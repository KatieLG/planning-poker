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
    d="M5 8.5
       L10.5 8.5
       C10.5 6.5 11.5 5.75 13 5.75
       C14.5 5.75 15 6.75 15 8.25
       L17 8.25
       C18.5 8.25 19 9 19 10.5
       L19 14.75
       C19 16.75 18 17.5 16.5 17.5
       L12 17.5
       C10.9 17.5 10 16.9 9.75 16
       C8.85 15.9 8.85 14.6 9.75 14.5
       C8.85 14.4 8.85 13.1 9.75 13
       C8.85 12.9 8.85 11.6 9.75 11.5
       L5 11.5
       C4 11.5 4 8.5 5 8.5 Z"
  />
</svg>
