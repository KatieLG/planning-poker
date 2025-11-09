import type { Room } from 'shared';

export type AppState = {
  currentRoom: Room | null;
  currentUserId: string | null;
};

const defaultState: AppState = {
  currentRoom: null,
  currentUserId: null
};

export const appState = $state<AppState>(defaultState);
