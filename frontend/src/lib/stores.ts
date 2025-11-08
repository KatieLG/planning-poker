import { writable, type Writable } from 'svelte/store';
import type { Room } from 'shared';

export const currentRoom: Writable<Room | null> = writable<Room | null>(null);
