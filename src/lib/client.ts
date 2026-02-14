import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { SocketEvent } from '../../shared/types';
import type { JoinRoomParams, JoinRoomResponse, Room, CreateRoomParams } from '../../shared/types';
import { io, type Socket } from 'socket.io-client';
import { appState } from '$lib/stores.svelte';
import { pubsub } from '$lib/pubsub';

const socket: Socket | null = browser ? io() : null;

const clearUserData = () => {
  localStorage.removeItem('roomId');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('userIcon');
};

if (socket) {
  socket.on('connect', () => {});

  socket.on('disconnect', () => {});

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
    clearUserData();
    pubsub.emit('toast', {
      type: 'info',
      message: 'The room has been disbanded by the host'
    });
    goto(resolve('/', {}));
  });

  socket.on(SocketEvent.ERROR, (error: { message: string | null }) => {
    pubsub.emit('error', error.message);
  });

  socket.on(SocketEvent.ROOM_NOT_FOUND, (data: { roomId: string }) => {
    pubsub.emit('roomNotFound', data.roomId);
  });

  socket.on(SocketEvent.ROOM_FOUND, (data: { roomId: string }) => {
    pubsub.emit('roomFound', data.roomId);
  });

  socket.on(SocketEvent.UNANIMOUS_VOTE, () => {
    pubsub.emit('unanimousVote');
  });
}

export function createRoom(params: CreateRoomParams) {
  socket?.emit(SocketEvent.CREATE_ROOM, params);
}

export function joinRoom(params: JoinRoomParams) {
  // Include previous userId in case reconnecting
  const savedUserId = browser ? localStorage.getItem('userId') : null;
  socket?.emit(SocketEvent.JOIN_ROOM, {
    ...params,
    savedUserId: savedUserId
  });
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
  clearUserData();
  socket?.emit(SocketEvent.LEAVE_ROOM);
}

export function checkRoom(roomId: string) {
  socket?.emit(SocketEvent.CHECK_ROOM, roomId);
}
