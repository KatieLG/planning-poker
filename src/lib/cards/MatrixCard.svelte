<script lang="ts">
  import { onMount } from 'svelte';
  import type { User } from '../../../shared/types';
  import CardContent from './CardContent.svelte';

  let {
    user,
    revealed
  }: {
    user: User;
    revealed: boolean;
  } = $props();

  let canvas: HTMLCanvasElement;

  const CHARS =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';

  onMount(() => {
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width;
    const H = canvas.height;
    const fontSize = 9;
    const cols = Math.floor(W / fontSize);
    const drops: number[] = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(30, 30, 30, 0.15)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > H && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  });
</script>

<div class="card shadow-xl relative overflow-hidden matrix-border">
  <canvas bind:this={canvas} class="absolute inset-0 w-full h-full rounded-2xl"></canvas>
  <div class="card-body items-center text-center p-4 relative z-10">
    <CardContent {user} {revealed} nameClass="text-green-400" valueClass="text-green-400" />
  </div>
</div>

<style>
  .matrix-border {
    border: 3px solid transparent;
    background-image:
      linear-gradient(rgb(30, 30, 30), rgb(30, 30, 30)),
      linear-gradient(90deg, #00ff41, #00b300, #39ff14, #008000, #00ff41);
    background-clip: padding-box, border-box;
    background-size: 300%;
    animation: matrix-border-spin 2s linear infinite;
  }

  @keyframes matrix-border-spin {
    to {
      background-position:
        0 0,
        300% 0;
    }
  }
</style>
