export type User = {
  id: string;
  name: string;
  icon?: string;
  isHost: boolean;
  cardValue?: number | null;
};

export type Room = {
  id: string;
  hostId: string;
  users: User[];
  revealed: boolean;
};

export type RoomUserLink = {
  roomId: string;
  userId: string;
};

export type JoinRoomParams = {
  roomId: string;
  name: string;
  icon?: string;
};

export type JoinRoomResponse = {
  room: Room;
  userId: string;
};

export const SocketEvent = {
  DISCONNECT: 'disconnect',
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  GET_ROOM: 'get_room',
  VOTE: 'vote',
  REVEAL_CARDS: 'reveal_cards',
  RESET_VOTES: 'reset_votes',
  ROOM_UPDATE: 'room_update',
  RESET_ROOM: 'reset_room',
  ERROR: 'error'
} as const;

export type SocketEvent = keyof typeof SocketEvent;
