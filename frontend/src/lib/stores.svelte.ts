import type { Room } from 'shared';

let room = $state<Room | null>(null);

export const currentRoom = {
  get value() {
    return room;
  },
  set(value: Room | null) {
    room = value;
  }
};
