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

export type CreateRoomParams = {
  name: string;
  icon?: string;
};

export type JoinRoomParams = CreateRoomParams & {
  roomId: string;
  savedUserId?: string; // send the user id in local storage if exists, for reconnecting
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
  DISBAND_ROOM: 'disband_room',
  VOTE: 'vote',
  UNANIMOUS_VOTE: 'unanimous_vote',
  REVEAL_CARDS: 'reveal_cards',
  RESET_VOTES: 'reset_votes',
  ROOM_UPDATE: 'room_update',
  RESET_ROOM: 'reset_room',
  CHECK_ROOM: 'check_room',
  ROOM_FOUND: 'room_found',
  ROOM_NOT_FOUND: 'room_not_found',
  ERROR: 'error'
} as const;

export type SocketEvent = keyof typeof SocketEvent;
