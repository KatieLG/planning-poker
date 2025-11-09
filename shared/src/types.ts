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
  DISCONNECT: 'DISCONNECT',
  CREATE_ROOM: 'CREATE_ROOM',
  JOIN_ROOM: 'JOIN_ROOM',
  LEAVE_ROOM: 'LEAVE_ROOM',
  GET_ROOM: 'GET_ROOM',
  VOTE: 'VOTE',
  REVEAL_CARDS: 'REVEAL_CARDS',
  RESET_VOTES: 'RESET_VOTES',
  ROOM_UPDATE: 'ROOM_UPDATE',
  RESET_ROOM: 'RESET_ROOM',
  ERROR: 'ERROR'
} as const;

export type SocketEvent = keyof typeof SocketEvent;
