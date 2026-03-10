import { io } from 'socket.io-client';

const user_id = 'bc61c4fa-d404-408f-97d5-3079d7b8c73a'; // receptor
const socket = io('http://localhost:3007');

socket.on('connect', () => {
  console.log('Conectado ao Socket.io, ID:', socket.id);

  // Entrar na sala do usuário
  socket.emit('join', user_id);
  console.log(`Entrou na sala do usuário ${user_id}`);
});

socket.on('new_message', (message) => {
  console.log('📩 Nova mensagem recebida:', message);
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor');
});
