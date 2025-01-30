const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Adjust CORS configuration for Vercel
// local: http://localhost:5173
// global: https://enlighten-ed-omega.vercel.app
const io = new Server(server, {
  cors: {
    origin: "https://enlighten-ed-omega.vercel.app", // Frontend URL   
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow more methods
    credentials: true,
  },
  // path: "/socket.io", // Explicitly set the socket.io path
});

// Middleware
app.use(cors({
  origin: "https://enlighten-ed-omega.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow more methods
  credentials: true,
}));

// Handle preflight requests
app.options("*", cors({
  origin: "https://enlighten-ed-omega.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

// Port configuration
const PORT = process.env.PORT || 8080;

// Basic route
app.get("/", (req, res) => {
  res.send("Backend is up and running on port: " + PORT);
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Emit current socket ID to the client
  socket.emit("me", socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    socket.broadcast.emit("callEnded");
  });

  // Handle call initiation
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    console.log(`Calling user: ${userToCall}`);
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  // Handle call answer
  socket.on("answerCall", (data) => {
    console.log(`Call answered by: ${data.to}`);
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
