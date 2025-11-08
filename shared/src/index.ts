export type User = {
  id: string;
  name: string;
  icon?: string;
  isHost: boolean;
  cardValue?: string;
};

export type Room = {
  id: string;
  hostId: string;
  users: User[];
  revealed: boolean;
};

export const SocketEvent = {
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  VOTE: 'vote',
  REVEAL_CARDS: 'reveal_cards',
  RESET_VOTES: 'reset_votes',
  ROOM_UPDATE: 'room_update',
  RESET_ROOM: 'reset_room'
} as const;
