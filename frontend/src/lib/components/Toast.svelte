<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { pubsub } from '$lib/pubsub';

  type ToastType = 'success' | 'error' | 'info' | 'warning';
  
  interface Toast {
    type: ToastType;
    message: string;
  }

  let toasts = $state<Toast[]>([]);

  const removeToast = (toast: Toast) => {
    toasts = toasts.filter(t => t !== toast);
  }

  onMount(() => {
    return pubsub.on('toast', (data: { type: ToastType; message: string }) => {
      if (!data) return;
      toasts.push({ message: data.message, type: data.type });
    });
  });
</script>

<div class="toast toast-center toast-top">
  {#each toasts as toast}
    <div
      class={`alert shadow-lg mb-2 alert-${toast.type}`}
      transition:fade={{ duration: 200, easing: cubicOut }}
      role="alert"
    >
        <span class="flex-grow text-left">{toast.message}</span>
        <button
          class="btn btn-ghost btn-sm btn-circle"
          onclick={() => removeToast(toast)}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
    </div>
  {/each}
</div>
