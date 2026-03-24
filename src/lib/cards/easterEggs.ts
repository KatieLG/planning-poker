import { browser } from '$app/environment';
import type { User } from '../../../shared/types';
import NormalCard from './NormalCard.svelte';
import RainbowCard from './RainbowCard.svelte';
import MatrixCard from './MatrixCard.svelte';
import AngryCard from './AngryCard.svelte';
import AquariumCard from './AquariumCard.svelte';

// Add new easter egg card components here and add a check in getCardComponent below.
export type CardComponent =
  | typeof NormalCard
  | typeof RainbowCard
  | typeof MatrixCard
  | typeof AngryCard
  | typeof AquariumCard;

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

function isAllCaps(name: string): boolean {
  return name.trim().length > 1 && name.trim() === name.trim().toUpperCase() && /[A-Z]/.test(name);
}

export function getCardComponent(user: User): CardComponent {
  if (isValidHTML(user.name)) return MatrixCard;
  if (isAllCaps(user.name)) return AngryCard;
  if (user.name.includes('🦞')) return LobsterCard;
  if (isRainbow(user.name)) return RainbowCard;
  return NormalCard;
}
