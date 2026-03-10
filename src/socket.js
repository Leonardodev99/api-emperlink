import { Server } from 'socket.io';
import Message from './models/Message.js'; // Seu model de mensagens
import User from './models/User.js';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  const onlineUsers = new Map(); // Map<userId, socketId>

  io.on('connection', (socket) => {
    console.log('Novo usuário conectado:', socket.id);

    // --- Usuário entra online ---
    socket.on('user_online', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`Usuário ${userId} online`);

      // Notifica outros usuários
      io.emit('user_online', userId);
    });

    // --- Usuário sai offline ---
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('user_offline', socket.userId);
        console.log(`Usuário ${socket.userId} offline`);
      }
    });

    // --- Usuário digitando ---
    socket.on('typing', ({ to }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit('typing', { from: socket.userId });
    });

    socket.on('stop_typing', ({ to }) => {
      const targetSocket = onlineUsers.get(to);
      if (targetSocket) io.to(targetSocket).emit('stop_typing', { from: socket.userId });
    });

    // --- Mensagem enviada ---
    socket.on('send_message', async (data) => {
      const { sender_id, receiver_id, content } = data;

      try {
        const message = await Message.create({ sender_id, receiver_id, content });

        // Entrega da mensagem
        const targetSocket = onlineUsers.get(receiver_id);
        if (targetSocket) {
          io.to(targetSocket).emit('delivered', message);
        }

        // Retorna confirmação para quem enviou
        socket.emit('sent', message);

      } catch (err) {
        console.error('Erro ao enviar mensagem via socket:', err);
      }
    });

    // --- Mensagem lida ---
    socket.on('read', async ({ messageId }) => {
      try {
        const message = await Message.findByPk(messageId);
        if (!message) return;

        await message.update({ is_read: true });

        // Notifica quem enviou
        const senderSocket = onlineUsers.get(message.sender_id);
        if (senderSocket) io.to(senderSocket).emit('read', messageId);

      } catch (err) {
        console.error('Erro ao marcar mensagem como lida:', err);
      }
    });

    // --- Chat de grupo ---
    socket.on('join_group', (group_id) => {
      socket.join(group_id);
      console.log(`Usuário ${socket.userId} entrou no grupo ${group_id}`);
    });

    socket.on('group_message', async ({ group_id, sender_id, content }) => {
      try {
        // Aqui você pode salvar no banco caso queira persistência
        const message = await Message.create({
          sender_id,
          content,
          group_id
        });

        io.to(group_id).emit('group_message', message);

      } catch (err) {
        console.error('Erro ao enviar mensagem de grupo:', err);
      }
    });

  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io não inicializado');
  return io;
}
