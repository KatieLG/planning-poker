import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { JoinRoomParams, SocketEvent } from 'shared';
import cors from 'cors';
import { createRoom, joinRoom, getRoom, leaveRoom, userVote } from './roomService.js';

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

  socket.on(SocketEvent.DISCONNECT, () => {
    // TODO: If you refresh the page at current, you get disconnected and dont reconnect
    // Also need to handle disbanding room if host leaves
    console.log('user disconnected');
    let updatedRoom = leaveRoom(socket.id);
    if (updatedRoom) {
      io.to(updatedRoom.id).emit(SocketEvent.ROOM_UPDATE, updatedRoom);
    }
  });

  socket.on(SocketEvent.CREATE_ROOM, () => {
    console.log('creating room for socket:', socket.id);

    let room = createRoom(socket.id);
    socket.join(room.id);
    socket.emit(SocketEvent.CREATE_ROOM, room);
  });

  socket.on(SocketEvent.JOIN_ROOM, (params: JoinRoomParams) => {
    console.log('joining room:', params.roomId, 'for user:', params.name);

    let response = joinRoom(socket.id, params.roomId, params.name, params.icon);

    if (response) {
      let { room, userId } = response;
      socket.emit(SocketEvent.JOIN_ROOM, { room: room, userId: userId });
      socket.join(room.id);
      io.to(room.id).emit(SocketEvent.ROOM_UPDATE, room);
    } else {
      socket.emit(SocketEvent.ERROR, { message: 'Room not found' });
    }
  });

  socket.on(SocketEvent.GET_ROOM, (roomId: string) => {
    console.log('getting room:', roomId);

    let room = getRoom(roomId);
    if (room) {
      socket.join(room.id);
      socket.emit(SocketEvent.GET_ROOM, room);
    } else {
      socket.emit(SocketEvent.ERROR, { message: 'Room not found' });
    }
  });

  socket.on(SocketEvent.VOTE, (cardValue: number | null) => {
    console.log('user voting with value:', cardValue);

    let room = userVote(socket.id, cardValue);
    if (room) {
      io.to(room.id).emit(SocketEvent.ROOM_UPDATE, room);
    } else {
      socket.emit(SocketEvent.ERROR, { message: 'User or room not found' });
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
