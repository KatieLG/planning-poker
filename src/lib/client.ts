import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { SocketEvent } from '../../shared/types';
import type { JoinRoomParams, JoinRoomResponse, Room } from '../../shared/types';
import { io, Socket } from 'socket.io-client';
import { appState } from '$lib/stores.svelte';
import { pubsub } from '$lib/pubsub';

const socket: Socket | null = browser ? io() : null;

if (socket) {
  socket.on('connect', () => {
  });

  socket.on('disconnect', () => {
  });

  socket.on(SocketEvent.CREATE_ROOM, (room: Room) => {
    localStorage.setItem('roomId', room.id);
    localStorage.setItem('userId', room.hostId);
    appState.currentRoom = room;
    appState.currentUserId = room.hostId;
    goto(resolve(`/room/${room.id}`, {}));
  });

  socket.on(SocketEvent.JOIN_ROOM, (data: JoinRoomResponse) => {
    localStorage.setItem('roomId', data.room.id);
    localStorage.setItem('userId', data.userId);
    appState.currentRoom = data.room;
    appState.currentUserId = data.userId;
    goto(resolve(`/room/${data.room.id}`, {}));
  });

  socket.on(SocketEvent.ROOM_UPDATE, (room: Room) => {
    appState.currentRoom = room;
  });

  socket.on(SocketEvent.DISBAND_ROOM, () => {
    appState.currentRoom = null;
    appState.currentUserId = null;
    localStorage.clear();
    pubsub.emit('toast', {
      type: 'info',
      message: 'The room has been disbanded by the host'
    });
    goto(resolve('/', {}));
  });

  socket.on(SocketEvent.ERROR, (error: { message: string | null }) => {
    pubsub.emit('error', error.message);
  });
}

export function createRoom() {
  socket?.emit(SocketEvent.CREATE_ROOM);
}

export function joinRoom(params: JoinRoomParams) {
  socket?.emit(SocketEvent.JOIN_ROOM, params);
}

export function vote(cardValue: number | null) {
  socket?.emit(SocketEvent.VOTE, cardValue);
}

export function revealCards() {
  socket?.emit(SocketEvent.REVEAL_CARDS);
}

export function resetRoom() {
  socket?.emit(SocketEvent.RESET_ROOM);
}

export function leaveRoom() {
  socket?.emit(SocketEvent.LEAVE_ROOM);
}
