import { Room, User, RoomUserLink } from 'shared';
import { nanoid } from 'nanoid';

const rooms = new Map<string, Room>();
const socketMap = new Map<string, RoomUserLink>();

type RoomContext = {
  room: Room;
  user: User;
  link: RoomUserLink;
};

const getRoomContext = (socketId: string): RoomContext | null => {
  const link = socketMap.get(socketId);
  if (!link) return null;

  const room = rooms.get(link.roomId);
  if (!room) return null;

  const user = room.users.find((u) => u.id === link.userId);
  if (!user) return null;

  return { room, user, link };
};

export const createRoom = (socketId: string): Room => {
  const roomId = nanoid();
  const userId = nanoid();

  const host: User = {
    id: userId,
    icon: '👑',
    name: 'Host',
    isHost: true
  };

  const newRoom: Room = {
    id: roomId,
    users: [host],
    hostId: userId,
    revealed: false
  };

  rooms.set(roomId, newRoom);
  socketMap.set(socketId, { roomId, userId });

  return newRoom;
};

export const getRoom = (roomId: string): Room | null => {
  return rooms.get(roomId) || null;
};

export const joinRoom = (
  socketId: string,
  roomId: string,
  name: string,
  icon?: string
): { room: Room; userId: string } | null => {
  const room = rooms.get(roomId);
  if (!room) return null;

  const userId = nanoid();
  const user: User = {
    id: userId,
    name,
    icon,
    isHost: false
  };

  socketMap.set(socketId, { roomId, userId });
  room.users.push(user);
  return { room, userId };
};

export const leaveRoom = (socketId: string): Room | null => {
  const context = getRoomContext(socketId);
  if (!context) return null;

  const { room, link } = context;
  room.users = room.users.filter((user) => user.id !== link.userId);
  socketMap.delete(socketId);
  return room;
};

export const userVote = (socketId: string, cardValue: number | null): Room | null => {
  const context = getRoomContext(socketId);
  if (!context) return null;

  const { user, room } = context;
  user.cardValue = cardValue;
  return room;
};

export const revealCards = (socketId: string): Room | null => {
  const context = getRoomContext(socketId);
  if (!context) return null;

  const { room, user } = context;
  if (!user.isHost) return null;

  room.revealed = true;
  return room;
};

export const resetRoom = (socketId: string): Room | null => {
  const context = getRoomContext(socketId);
  if (!context) return null;

  const { room, user } = context;
  if (!user.isHost) return null;

  room.revealed = false;
  room.users.forEach((u) => {
    u.cardValue = undefined;
  });

  return room;
};
