import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";
import cors from "cors";

const app = express();
const server = createServer(app);

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Planning Poker Backend is running</h1>");
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (message: string) => {
    console.log("message received:", message);
    io.emit("message", message);
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
