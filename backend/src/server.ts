import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import { JoinRoomParams, SocketEvent, Room } from 'shared';
import cors from 'cors';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  userVote,
  revealCards,
  resetRoom
} from './roomService.js';

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4173';

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: frontendUrl,
  }
});

const handleEvent = (socket: Socket, handler: () => void) => {
  try {
    handler();
  } catch (error: unknown) {
    console.error('Error handling event for socket', socket.id, error);
    let errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    socket.emit(SocketEvent.ERROR, { message: errorMessage });
  }
};

const updateRoom = (room: Room) => {
  io.to(room.id).emit(SocketEvent.ROOM_UPDATE, room);
};

const handleLeaveRoom = (socket: Socket) => {
  handleEvent(socket, () => {
    console.log('user disconnecting', socket.id);
    let { room, disband } = leaveRoom(socket.id);
    socket.leave(room.id);
    if (disband) {
      console.log('disbanding room');
      io.to(room.id).emit(SocketEvent.DISBAND_ROOM);
    } else updateRoom(room);
  });
};

io.on('connection', (socket: Socket) => {
  console.log('a user connected', socket.id);

  socket.on(SocketEvent.DISCONNECT, () => {
    console.log('Disconnect event for socket', socket.id);
    handleLeaveRoom(socket);
  });

  socket.on(SocketEvent.LEAVE_ROOM, () => {
    console.log('Leave event for socket', socket.id);
    handleLeaveRoom(socket);
  });

  socket.on(SocketEvent.CREATE_ROOM, () => {
    handleEvent(socket, () => {
      let room = createRoom(socket.id);
      socket.join(room.id);
      socket.emit(SocketEvent.CREATE_ROOM, room);
    });
  });

  socket.on(SocketEvent.JOIN_ROOM, (params: JoinRoomParams) => {
    handleEvent(socket, () => {
      let { room, userId } = joinRoom(socket.id, params.roomId, params.name, params.icon);
      socket.emit(SocketEvent.JOIN_ROOM, { room: room, userId: userId });
      socket.join(room.id);
      updateRoom(room);
    });
  });

  socket.on(SocketEvent.VOTE, (cardValue: number | null) => {
    handleEvent(socket, () => {
      let room = userVote(socket.id, cardValue);
      updateRoom(room);
    });
  });

  socket.on(SocketEvent.REVEAL_CARDS, () => {
    handleEvent(socket, () => {
      let room = revealCards(socket.id);
      updateRoom(room);
    });
  });

  socket.on(SocketEvent.RESET_ROOM, () => {
    handleEvent(socket, () => {
      let room = resetRoom(socket.id);
      updateRoom(room);
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
