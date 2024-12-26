const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidV4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

// Serve static files (frontend)
app.use(express.static('public'));

// Route to create a new room
app.get('/room', (req, res) => {
  const roomId = uuidV4(); // Generate unique room ID
  res.redirect(`/${roomId}`); // Redirect to the unique room
});

// Serve the room page
app.get('/:room', (req, res) => {
  res.sendFile(__dirname + '/public/room.html');
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    console.log(`User ${userId} joined room ${roomId}`);
    socket.join(roomId);

    // Notify other participants
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
