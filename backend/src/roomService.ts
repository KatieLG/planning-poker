import { Room, User } from 'shared';

const rooms = new Map<string, Room>();

const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createRoom = (hostId: string): Room => {
  const roomId = generateRoomId();
  const newRoom: Room = {
    id: roomId,
    users: [],
    hostId: hostId,
    revealed: false
  };
  rooms.set(roomId, newRoom);
  return newRoom;
};

export const joinRoom = (roomId: string, user: User): Room | null => {
  const room = rooms.get(roomId);
  room?.users.push(user);
  return room || null;
};
