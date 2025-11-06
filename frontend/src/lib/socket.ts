import { browser } from '$app/environment';
import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';
const messages = [];

const socket = browser ? io(URL) : null;

if (socket) {
  socket.on('connect', () => {
    console.log('Connected to server with id:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('message', (message: string) => {
    console.log('New message received:', message);
    messages.push(message);
  });
}

export function sendMessage(message: string) {
  console.log('Sending message:', message);
  socket?.emit('message', message);
}
