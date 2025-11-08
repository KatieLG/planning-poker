import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { SocketEvent } from 'shared';
import type { JoinRoomParams, JoinRoomResponse, Room } from 'shared';
import { io, Socket } from 'socket.io-client';
import { currentRoom } from './stores.svelte';

const URL = 'http://localhost:3000';

const socket: Socket | null = browser ? io(URL) : null;

if (socket) {
  socket.on('connect', () => {
    console.log('Connected to server with id:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on(SocketEvent.CREATE_ROOM, (room: Room) => {
    console.log('Room created:', room);
    localStorage.setItem('roomId', room.id);
    localStorage.setItem('userId', room.hostId);
    currentRoom.set(room);
    goto(resolve(`/room/${room.id}`, {}));
  });

  socket.on(SocketEvent.GET_ROOM, (room: Room) => {
    console.log('Room data received:', room);
    currentRoom.set(room);
  });

  socket.on(SocketEvent.JOIN_ROOM, (data: JoinRoomResponse) => {
    console.log('Joined room:', data.room);
    localStorage.setItem('roomId', data.room.id);
    localStorage.setItem('userId', data.userId);
    currentRoom.set(data.room);
    goto(resolve(`/room/${data.room.id}`, {}));
  });

  socket.on(SocketEvent.ROOM_UPDATE, (room: Room) => {
    console.log('Room updated:', room);
    currentRoom.set(room);
  });
}

export function createRoom() {
  socket?.emit(SocketEvent.CREATE_ROOM);
}

export function getRoom(roomId: string) {
  socket?.emit(SocketEvent.GET_ROOM, roomId);
}

export function joinRoom(params: JoinRoomParams) {
  socket?.emit(SocketEvent.JOIN_ROOM, params);
}

export function vote(cardValue: number | null) {
  console.log('voting with value:', cardValue);
  socket?.emit(SocketEvent.VOTE, cardValue);
}
