import type { Room, User, RoomUserLink } from '../shared/types';
import { nanoid } from 'nanoid';

const rooms = new Map<string, Room>();
const socketMap = new Map<string, RoomUserLink>();

// Track disbanding rooms with grace period for host reconnection
const disbandingRooms = new Map<string, NodeJS.Timeout>();
const HOST_RECONNECT_GRACE_PERIOD_MS = 30000; // 30 seconds

type RoomContext = {
  room: Room;
  user: User;
  link: RoomUserLink;
};

const getRoomContext = (socketId: string): RoomContext => {
  const link = socketMap.get(socketId);
  if (!link) throw new Error('Connection not associated to a user or room');

  const room = rooms.get(link.roomId);
  if (!room) throw new Error('Room not found');

  const user = room.users.find((u) => u.id === link.userId);
  if (!user) throw new Error('User not found in room');

  return { room, user, link };
};

export const createRoom = (socketId: string, name: string, icon?: string): Room => {
  const roomId = nanoid();
  const userId = nanoid();

  const host: User = {
    id: userId,
    icon,
    name,
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

export const joinRoom = (
  socketId: string,
  roomId: string,
  name: string,
  icon?: string
): { room: Room; userId: string } => {
  const room = rooms.get(roomId);
  if (!room) throw new Error('Room not found');

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

export const leaveRoom = (socketId: string): { room: Room; hostDisconnected: boolean } => {
  const context = getRoomContext(socketId);
  socketMap.delete(socketId);

  const { room, link } = context;
  room.users = room.users.filter((user) => user.id !== link.userId);
  const isHost = room.hostId === link.userId;

  return { room, hostDisconnected: isHost };
};

export const scheduleDisband = (roomId: string, onDisband: () => void): void => {
  // If room already scheduled, skip
  if (disbandingRooms.has(roomId)) return;

  const timeout = setTimeout(() => {
    const room = rooms.get(roomId);
    if (room) {
      rooms.delete(roomId);
      disbandingRooms.delete(roomId);
      onDisband();
    }
  }, HOST_RECONNECT_GRACE_PERIOD_MS);

  disbandingRooms.set(roomId, timeout);
};

export const cancelDisband = (roomId: string): void => {
  const timeout = disbandingRooms.get(roomId);
  if (timeout) {
    clearTimeout(timeout);
    disbandingRooms.delete(roomId);
  }
};

export const isRoomDisbanding = (roomId: string): boolean => {
  return disbandingRooms.has(roomId);
};

export const roomExists = (roomId: string): boolean => {
  return rooms.has(roomId);
};

// Rejoin room during grace period
export const rejoinRoom = (
  socketId: string,
  roomId: string,
  name: string,
  icon?: string,
  previousUserId?: string
): { room: Room; userId: string } | null => {
  const room = rooms.get(roomId);
  if (!room) return null;

  // Check if this is the original host reconnecting
  const isHostReturning = previousUserId === room.hostId;

  const userId = nanoid();
  const user: User = {
    id: userId,
    name,
    icon,
    isHost: isHostReturning
  };

  socketMap.set(socketId, { roomId, userId });
  room.users.push(user);

  // If the original host is returning, update hostId and cancel disband
  if (isHostReturning) {
    console.log('host reconnected', socketId);
    room.hostId = userId;
    cancelDisband(roomId);
  }

  return { room, userId };
};

export const userVote = (socketId: string, cardValue: number | null): Room => {
  const context = getRoomContext(socketId);

  const { user, room } = context;
  user.cardValue = cardValue;
  return room;
};

export const revealCards = (socketId: string): Room => {
  const context = getRoomContext(socketId);

  const { room, user } = context;
  if (!user.isHost) throw new Error('Only the host can reveal cards');

  room.revealed = true;
  return room;
};

export const resetRoom = (socketId: string): Room => {
  const context = getRoomContext(socketId);

  const { room, user } = context;
  if (!user.isHost) throw new Error('Only the host can reset the room');

  room.revealed = false;
  room.users.forEach((u) => {
    u.cardValue = undefined;
  });

  return room;
};
