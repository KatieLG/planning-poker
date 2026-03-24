import { browser } from '$app/environment';
import { settings } from '$lib/settings.svelte';
import type { User } from '../../../shared/types';
import NormalCard from './NormalCard.svelte';
import RainbowCard from './RainbowCard.svelte';
import MatrixCard from './MatrixCard.svelte';
import AngryCard from './AngryCard.svelte';
import AquariumCard from './AquariumCard.svelte';

export type CardComponent =
  | typeof NormalCard
  | typeof RainbowCard
  | typeof MatrixCard
  | typeof AngryCard
  | typeof AquariumCard;

const SEA_CREATURE_EMOJIS = new Set([
  '🐟',
  '🐠',
  '🐡',
  '🦈',
  '🐬',
  '🐳',
  '🐋',
  '🦭',
  '🦞',
  '🦀',
  '🦑',
  '🐙',
  '🦐',
  '🐚',
  '🦪'
]);

function isValidHTML(name: string): boolean {
  if (!browser) return false;
  const doc = new DOMParser().parseFromString(name, 'text/html');
  return doc.body.children.length > 0;
}

function isSpecialName(name: string): boolean {
  const userSum = [...name.toLowerCase()].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return [959, 625].includes(userSum % 1000);
}

function isAllCaps(name: string): boolean {
  return name.trim().length > 1 && name.trim() === name.trim().toUpperCase() && /[A-Z]/.test(name);
}

function hasSeaCreature(name: string): boolean {
  return [...name].some((char) => SEA_CREATURE_EMOJIS.has(char));
}

export function getCardComponent(user: User): CardComponent {
  if (!settings.easterEggsEnabled) return NormalCard;

  if (isValidHTML(user.name)) return MatrixCard;
  if (isAllCaps(user.name)) return AngryCard;
  if (hasSeaCreature(user.name)) return AquariumCard;
  if (isSpecialName(user.name)) return RainbowCard;
  return NormalCard;
}
