import type { Room } from 'shared';

export type AppState = {
  currentRoom: Room | null;
};

const defaultState: AppState = {
  currentRoom: null
};

export const appState = $state<AppState>(defaultState);
