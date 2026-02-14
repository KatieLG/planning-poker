import express from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'node:http';
import {
  type JoinRoomParams,
  SocketEvent,
  type Room,
  type CreateRoomParams
} from '../shared/types';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  userVote,
  revealCards,
  resetRoom,
  scheduleDisband,
  roomExists,
  rejoinRoom,
  isRoomDisbanding,
  isVoteUnanimous
} from '../server/roomService';
import { handler } from '../build/handler.js';

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const io = new Server(server);

app.use(handler);

const handleEvent = (socket: Socket, handler: () => void) => {
  try {
    handler();
  } catch (error: unknown) {
    console.error('Error handling event for socket', socket.id, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    socket.emit(SocketEvent.ERROR, { message: errorMessage });
  }
};

const updateRoom = (room: Room) => {
  io.to(room.id).emit(SocketEvent.ROOM_UPDATE, room);
};

const handleLeaveRoom = (socket: Socket) => {
  handleEvent(socket, () => {
    console.log('user disconnecting', socket.id);
    const { room, hostDisconnected } = leaveRoom(socket.id);
    socket.leave(room.id);

    if (hostDisconnected) {
      // schedule disband after grace period if host does not reconnect
      scheduleDisband(room.id, () => {
        io.to(room.id).emit(SocketEvent.DISBAND_ROOM);
      });
    }

    updateRoom(room);
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

  socket.on(SocketEvent.CREATE_ROOM, (params: CreateRoomParams) => {
    handleEvent(socket, () => {
      const room = createRoom(socket.id, params.name, params.icon);
      socket.join(room.id);
      socket.emit(SocketEvent.CREATE_ROOM, room);
    });
  });

  socket.on(SocketEvent.JOIN_ROOM, (params: JoinRoomParams) => {
    handleEvent(socket, () => {
      if (!roomExists(params.roomId)) {
        socket.emit(SocketEvent.ROOM_NOT_FOUND, { roomId: params.roomId });
        return;
      }

      // Check if room is disbanding (host reconnecting)
      if (isRoomDisbanding(params.roomId)) {
        const result = rejoinRoom(
          socket.id,
          params.roomId,
          params.name,
          params.icon,
          params.savedUserId
        );
        if (!result) {
          socket.emit(SocketEvent.ROOM_NOT_FOUND, { roomId: params.roomId });
          return;
        }
        const { room, userId } = result;
        socket.emit(SocketEvent.JOIN_ROOM, { room, userId });
        socket.join(room.id);
        updateRoom(room);
        return;
      }

      // Normal join
      const { room, userId } = joinRoom(socket.id, params.roomId, params.name, params.icon);
      socket.emit(SocketEvent.JOIN_ROOM, { room, userId });
      socket.join(room.id);
      updateRoom(room);
    });
  });

  socket.on(SocketEvent.CHECK_ROOM, (roomId: string) => {
    handleEvent(socket, () => {
      const exists = roomExists(roomId);
      socket.emit(exists ? SocketEvent.ROOM_FOUND : SocketEvent.ROOM_NOT_FOUND, { roomId });
    });
  });

  socket.on(SocketEvent.VOTE, (cardValue: number | null) => {
    handleEvent(socket, () => {
      const room = userVote(socket.id, cardValue);
      updateRoom(room);
    });
  });

  socket.on(SocketEvent.REVEAL_CARDS, () => {
    handleEvent(socket, () => {
      const room = revealCards(socket.id);
      updateRoom(room);
      if (isVoteUnanimous(room)) {
        console.log('Emitting unanimous vote event for room', room.id);
        io.to(room.id).emit(SocketEvent.UNANIMOUS_VOTE);
      }
    });
  });

  socket.on(SocketEvent.RESET_ROOM, () => {
    handleEvent(socket, () => {
      const room = resetRoom(socket.id);
      updateRoom(room);
    });
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
