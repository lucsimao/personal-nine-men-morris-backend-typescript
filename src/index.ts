import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { makeGame } from './main/factories/GameController';

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);

const PORT = 3000;
app.use(express.static('public'));

//localhost:3000
(async () => {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  socketServer.on('chat', mensagem => {
    console.log('Recebendo mensagem', mensagem);
  });

  const game = makeGame(socketServer);

  await game.start();
})();
