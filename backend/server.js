const http = require("http");
const app = require('./app');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "https://unify-chat-h81q.vercel.app", "https://unifychat-2.onrender.com"],
    credentials: true,
  },
});

const port = process.env.PORT || 3000;
const db = require('./config/db.config');

app.set("socketio", io);

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  socket.userId = userId;
  next();
});

io.on("connection", (socket) => {
  console.log("Client connected with userId:", socket.userId);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.userId} joined room ${roomId}`);
  });
  socket.on("send-message", (message, roomID) => {
    console.log("Received send-message:", message, "for room:", roomID);
    if (!roomID || roomID === "") {
      // Broadcast to all except sender if no room specified
      socket.broadcast.emit("receive-message", message);
    } else {
      // Emit to all sockets in the room (excluding sender - they already have the message)
      // Using socket.to() instead of io.to() to exclude the sender
      socket.to(roomID).emit("receive-message", {
        ...message,
        chat_id: roomID,
        chatId: roomID,
      });
      console.log(`Broadcasting message to room ${roomID}`);
    }
  });
  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("user-typing", {
      userId: socket.userId,
      userName: data.userName,
      roomId: data.roomId,
    });
  });

  socket.on("stop-typing", (data) => {
    socket.to(data.roomId).emit("user-stop-typing", {
      userId: socket.userId,
      roomId: data.roomId,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
