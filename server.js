const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidV4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Serve static files
app.use(express.static('public'));

// Route to create a new room
app.get('/room', (req, res) => {
  const roomId = uuidV4(); // Generate unique room ID
  res.redirect(`/${roomId}`);
});

// Serve room page
app.get('/:room', (req, res) => {
  res.sendFile(__dirname + '/public/room.html');
});

// Socket.io logic
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);

    // Identify Host
    const clients = io.sockets.adapter.rooms.get(roomId);
    const isHost = clients.size === 1; // First user is the host

    // Notify the user of their host status
    socket.emit('host-status', isHost);

    // Notify others about the new user
    socket.to(roomId).emit('user-connected', userId);

    // Handle disconnection
    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

// Start server
server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
