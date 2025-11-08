import { Room, User, RoomUserLink } from 'shared';
import { nanoid } from 'nanoid';

const rooms = new Map<string, Room>();
const socketMap = new Map<string, RoomUserLink>();

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
  const userId = nanoid();

  if (!room) return null;

  const user: User = {
    id: userId,
    name,
    icon,
    isHost: false
  };
  socketMap.set(socketId, { roomId, userId });
  room.users.push(user);
  return { room: room, userId: userId };
};

export const leaveRoom = (socketId: string, userId: string): Room | null => {
  const link = socketMap.get(socketId);
  if (!link) return null;

  const room = rooms.get(link.roomId);
  if (!room) return null;

  room.users = room.users.filter((user) => user.id !== userId);
  socketMap.delete(socketId);
  return room;
};
