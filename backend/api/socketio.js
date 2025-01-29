import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true,
      },
      transports: ["websocket"],
    });

    io.on('connection', (socket) => {
      console.log('Client connected');
      
      socket.emit('me', socket.id);

      socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('callUser', {
          signal: data.signalData,
          from: data.from,
          name: data.name
        });
      });

      socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;

export const config = {
  api: {
    bodyParser: false
  }
};