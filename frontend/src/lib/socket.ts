import { browser } from '$app/environment';
import { SocketEvent } from 'shared';
import type { Room } from 'shared';
import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';

const socket = browser ? io(URL) : null;

if (socket) {
  socket.on('connect', () => {
    console.log('Connected to server with id:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on(SocketEvent.CREATE_ROOM, (room: Room) => {
    console.log('Room created:', room);
  });
}

export function createRoom() {
  const hostId = Math.random().toString(36).substring(2, 8);
  console.log('Creating room for hostId:', hostId);
  socket?.emit(SocketEvent.CREATE_ROOM, hostId);
}
