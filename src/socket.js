import { Server } from 'socket.io';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {

    console.log('🔌 Novo usuário conectado:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`👤 Usuário ${userId} entrou na sala`);
    });

    socket.on('disconnect', () => {
      console.log('❌ Usuário desconectado:', socket.id);
    });

  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.io não inicializado');
  }

  return io;
}
