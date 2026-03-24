import { browser } from '$app/environment';
import type { User } from '../../../shared/types';
import NormalCard from './NormalCard.svelte';
import RainbowCard from './RainbowCard.svelte';
import MatrixCard from './MatrixCard.svelte';

// Add new easter egg card components here and add a check in getCardComponent below.
export type CardComponent = typeof NormalCard | typeof RainbowCard | typeof MatrixCard;

function isValidHTML(name: string): boolean {
  if (!browser) return false;
  const doc = new DOMParser().parseFromString(name, 'text/html');
  return doc.body.children.length > 0;
}

function isRainbow(name: string): boolean {
  // 🐰🥚
  const userSum = [...name.toLowerCase()].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return [959, 625].includes(userSum % 1000);
}

export function getCardComponent(user: User): CardComponent {
  if (isValidHTML(user.name)) return MatrixCard;
  if (isRainbow(user.name)) return RainbowCard;
  return NormalCard;
}
