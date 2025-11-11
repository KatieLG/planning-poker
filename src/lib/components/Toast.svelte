<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { pubsub } from '$lib/pubsub';
  import Cross from '$lib/icons/Cross.svelte';

  type ToastType = 'success' | 'error' | 'info' | 'warning';

  interface Toast {
    id: string;
    type: ToastType;
    message: string;
  }

  let toasts = $state<Toast[]>([]);

  const removeToast = (toastId: string) => {
    toasts = toasts.filter((t) => t.id !== toastId);
  };

  onMount(() => {
    return pubsub.on('toast', (data: { type: ToastType; message: string }) => {
      if (!data) return;
      const id = Math.random().toString(36).substring(2, 9);
      const toast = { id, message: data.message, type: data.type };
      toasts.push(toast);

      setTimeout(() => {
        removeToast(id);
      }, 5000);
    });
  });
</script>

<div class="toast toast-center toast-top">
  {#each toasts as toast (toast.id)}
    <div
      class={`alert shadow-lg mb-2 alert-${toast.type}`}
      transition:fade={{ duration: 200, easing: cubicOut }}
      role="alert"
    >
      <span class="flex-grow text-left">{toast.message}</span>
      <button
        class="btn btn-ghost btn-sm btn-circle"
        onclick={() => removeToast(toast.id)}
        aria-label="Close"
      >
        <Cross classes="w-4 h-4" />
      </button>
    </div>
  {/each}
</div>
