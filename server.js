import http from 'http';
import app from './app.js';
import { initSocket } from './src/socket.js';

const port = 3007;

const server = http.createServer(app);

// 🔌 inicializa socket
initSocket(server);

server.listen(port, () => {
  console.log();
  console.log(`Escutando na porta ${port}`);
  console.log(`CRTL + Clique em http://localhost:${port}`);
});
