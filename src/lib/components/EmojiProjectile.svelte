<script lang="ts">
  import type { ThrowEmojiData } from '../../../shared/types';

  interface Props {
    emoji: ThrowEmojiData;
    targetElement: HTMLElement | null;
  }

  const { emoji, targetElement }: Props = $props();

  let projectile = $state<HTMLDivElement | null>(null);

  interface Position {
    x: number;
    y: number;
  }

  let startPos = $state<Position>({ x: 0, y: 0 });
  let targetPos = $state<Position>({ x: 0, y: 0 });
  let progress = $state(0);
  let isRemoved = $state(false);
  let rotation = $state(0);

  function getRandomPosition(): number {
    // Returns -1 to 1, biased towards 0 (center)
    const biased = Math.random() + Math.random() - 1;
    return Math.max(-1, Math.min(1, biased));
  }

  $effect(() => {
    if (!targetElement || !projectile) return;

    const rect = targetElement.getBoundingClientRect();
    const randomOffsetX = getRandomPosition() * (rect.width * 0.3); // 30% variation
    const randomOffsetY = getRandomPosition() * (rect.height * 0.3);

    startPos = {
      x: Math.random() > 0.5 ? -50 : window.innerWidth + 50,
      y: Math.random() * window.innerHeight
    };

    targetPos = {
      x: rect.left + rect.width / 2 + randomOffsetX,
      y: rect.top + rect.height / 2 + randomOffsetY
    };

    // Animate
    const startTime = Date.now();
    const duration = 600; // 600ms animation
    const initialRotation = Math.random() * 360;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);

      // Continuous rotation (like a spinning throw)
      rotation = initialRotation + progress * 720; // Full 2 rotations

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Remove after animation completes
        setTimeout(() => {
          isRemoved = true;
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  });

  // Parabolic arc for Y position (gravity effect)
  const currentX = $derived(startPos.x + (targetPos.x - startPos.x) * progress);
  const arcHeight = $derived(200); // Maximum arc height
  const currentY = $derived(
    startPos.y + (targetPos.y - startPos.y) * progress - arcHeight * Math.sin(progress * Math.PI)
  );

  // Calculate velocity-based scale (appears smaller when further away)
  const scale = $derived(1 - progress * 0.2);
</script>

{#if !isRemoved}
  <div
    bind:this={projectile}
    class="fixed pointer-events-none z-50 text-4xl"
    style="
      left: {currentX}px;
      top: {currentY}px;
      opacity: {progress < 0.85 ? 1 : Math.max(0, 1 - (progress - 0.85) / 0.15)};
      transform: translate(-50%, -50%) rotate({rotation}deg) scale({scale});
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 8px rgba(255, 255, 255, 0.6);
      filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
    "
  >
    {emoji.throwerEmoji}
  </div>
{/if}
