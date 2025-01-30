const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://enlighten-ed-omega.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io",
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});