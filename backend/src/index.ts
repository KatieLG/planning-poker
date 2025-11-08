import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { SocketEvent } from 'shared';
import cors from 'cors';
import { createRoom } from './roomService.js';

const app = express();
const server = createServer(app);

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on(SocketEvent.CREATE_ROOM, (hostId: string) => {
    console.log('creating room for host:', hostId);
    let room = createRoom(hostId);
    io.emit(SocketEvent.CREATE_ROOM, room);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
