import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { SocketEvent } from 'shared';
import cors from 'cors';
import { createRoom, joinRoom, getRoom } from './roomService.js';

const app = express();
const server = createServer(app);

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on(SocketEvent.CREATE_ROOM, () => {
    console.log('creating room for socket:', socket.id);

    let room = createRoom(socket.id);
    socket.join(room.id);
    socket.emit(SocketEvent.CREATE_ROOM, room);
  });

  socket.on(SocketEvent.JOIN_ROOM, (data: { roomId: string; name: string; icon?: string }) => {
    console.log('joining room:', data.roomId, 'for user:', data.name);

    let response = joinRoom(socket.id, data.roomId, data.name, data.icon);

    if (response) {
      let { room, userId } = response;
      socket.emit(SocketEvent.JOIN_ROOM, { room: room, userId: userId });
      socket.join(room.id);
      io.to(room.id).emit(SocketEvent.ROOM_UPDATE, room);
    } else {
      socket.emit(SocketEvent.ERROR, { message: 'Room not found' });
    }
  });

  socket.on(SocketEvent.GET_ROOM, (data: { roomId: string }) => {
    console.log('getting room:', data.roomId);

    let room = getRoom(data.roomId);
    if (room) {
      socket.join(room.id);
      socket.emit(SocketEvent.GET_ROOM, room);
    } else {
      socket.emit(SocketEvent.ERROR, { message: 'Room not found' });
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
