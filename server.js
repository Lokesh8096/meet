const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidV4 } = require('uuid');

// Initialize Express and HTTP Server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Serve Static Files
app.use(express.static('public'));

// Home Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Create Meeting Route
app.get('/create', (req, res) => {
  const roomId = uuidV4();
  res.json({ link: `http://localhost:3001/${roomId}` });
});

// Room Route
app.get('/:room', (req, res) => {
  res.sendFile(__dirname + '/public/room.html');
});

// Socket.IO Logic
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);

    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
