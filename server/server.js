import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
app.use(cors());
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on("Join_room", (room) => {
    socket.join(room);
    socket.to(room).emit("Receive_message", {
      author: "System",
      message: `A user has joined the room.`,
      time: new Date().toLocaleTimeString(),
    });
  });
  socket.on("Send_message", (data) => {
    console.log("Send message data", data);
    socket.to(data.room).emit("Receive_message", data);
  });
  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
  });
});
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
