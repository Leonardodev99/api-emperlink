import { io } from 'socket.io-client';

const user_id = 'bc61c4fa-d404-408f-97d5-3079d7b8c73a'; // ID do usuário que você quer testar
const socket = io('http://localhost:3007');

socket.on('connect', () => {
  console.log('Conectado ao Socket.io, ID:', socket.id);

  // Informar ao servidor que o usuário está online
  socket.emit('user_online', user_id);

  // Entrar na sala do usuário
  socket.emit('join', user_id);
  console.log(`Usuário ${user_id} entrou na sala`);
});

// Receber notificações de usuários online/offline
socket.on('user_online', (id) => {
  console.log(`✅ Usuário online: ${id}`);
});

socket.on('user_offline', (id) => {
  console.log(`❌ Usuário offline: ${id}`);
});

// Digitação
socket.on('typing', ({ from }) => {
  console.log(`✍️ Usuário ${from} está digitando...`);
});

socket.on('stop_typing', ({ from }) => {
  console.log(`🛑 Usuário ${from} parou de digitar`);
});

// Mensagem enviada/delivered/read
socket.on('sent', (message) => {
  console.log('📤 Mensagem enviada com sucesso:', message);
});

socket.on('delivered', (message) => {
  console.log('📬 Mensagem entregue:', message);
});

socket.on('read', (messageId) => {
  console.log('📖 Mensagem lida:', messageId);
});

// Chat de grupo
socket.on('group_message', (message) => {
  console.log('👥 Nova mensagem de grupo:', message);
});

// Desconexão
socket.on('disconnect', () => {
  console.log('Desconectado do servidor');
});

// Exemplo: enviar mensagem para outro usuário
function sendMessage(to, content) {
  socket.emit('send_message', { sender_id: user_id, receiver_id: to, content });
}

// Exemplo: digitar
function typing(to) {
  socket.emit('typing', { to });
}

function stopTyping(to) {
  socket.emit('stop_typing', { to });
}

// Exemplo: entrar em grupo
function joinGroup(group_id) {
  socket.emit('join_group', group_id);
}

// Exemplo: enviar mensagem de grupo
function sendGroupMessage(group_id, content) {
  socket.emit('group_message', { group_id, sender_id: user_id, content });
}

// Exportar funções para testar no terminal ou outro script
export { sendMessage, typing, stopTyping, joinGroup, sendGroupMessage };
