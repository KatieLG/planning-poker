<script lang="ts">
  import type { ThrowEmojiData } from '../../../shared/types';

  interface Props {
    emoji: ThrowEmojiData;
    targetElement: HTMLElement | null;
  }

  const { emoji, targetElement }: Props = $props();

  interface Position {
    x: number;
    y: number;
  }

  let startPos = $state<Position | null>(null);
  let targetPos = $state<Position | null>(null);
  let progress = $state(0);
  let fade = $state(0); // how faded the emoji is post landing from 0 (none) to 1 (fully faded)
  let isRemoved = $state(false);
  let rotation = $state(0);

  function getRandomPosition(): number {
    // random between [-1,1], triangular dist so biased toward center
    return Math.random() + Math.random() - 1;
  }

  $effect(() => {
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    // random offsets for the landing position, up to 50% of card width/height
    const randomOffsetX = getRandomPosition() * (rect.width * 0.5);
    const randomOffsetY = getRandomPosition() * (rect.height * 0.5);

    startPos = {
      // either -50 from left or +50 from right
      x: Math.random() > 0.5 ? -50 : window.innerWidth + 50,
      y: Math.random() * window.innerHeight
    };

    targetPos = {
      x: rect.left + rect.width / 2 + randomOffsetX,
      y: rect.top + rect.height / 2 + randomOffsetY
    };

    const startTime = Date.now();
    const animationDuration = 600; // milliseconds
    const initialRotation = Math.random() * 360;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / animationDuration, 1);

      // continuous rotation up to 2 full spins for a spinning emoji
      rotation = initialRotation + progress * 720;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Landed - fade out over 500ms, then remove
        fadeOut();
      }
    };

    const fadeDuration = 500; // milliseconds

    const fadeOut = () => {
      const start = Date.now();
      const step = () => {
        fade = Math.min((Date.now() - start) / fadeDuration, 1);
        if (fade < 1) {
          requestAnimationFrame(step);
        } else {
          isRemoved = true;
        }
      };
      requestAnimationFrame(step);
    };

    requestAnimationFrame(animate);
  });

  const peakHeight = 200; // peak height of the throw (px)
  const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

  // Emoji position between start and target, with a parabolic effect on height.
  const position = $derived.by(() => {
    if (!startPos || !targetPos) return null;
    const currentLift = peakHeight * Math.sin(progress * Math.PI); // peaks mid-flight
    return {
      x: lerp(startPos.x, targetPos.x, progress),
      y: lerp(startPos.y, targetPos.y, progress) - currentLift
    };
  });

  const opacity = $derived(1 - fade);
</script>

{#if !isRemoved && position}
  <div
    class="fixed pointer-events-none z-50 text-4xl"
    style="
      left: {position.x}px;
      top: {position.y}px;
      opacity: {opacity};
      transform: translate(-50%, -50%) rotate({rotation}deg);
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), 0 0 8px rgba(255, 255, 255, 0.6);
      filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
    "
  >
    {emoji.throwerEmoji}
  </div>
{/if}
