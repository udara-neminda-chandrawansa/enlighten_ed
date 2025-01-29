import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: '/socket',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    },
  });
  
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    // Your socket event handlers here
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
  });

  console.log('Socket is initialized');
  res.end();
};

export default SocketHandler;