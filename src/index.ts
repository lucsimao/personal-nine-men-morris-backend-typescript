import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { Logger } from './main/adapters';
import { makeGame } from './main/factories/GameController';

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server);

const PORT = 3000;
app.use(express.static('public'));

//localhost:3000
void (async () => {
  try {
    await new Promise<void>(resolve =>
      server.listen(PORT, () => {
        Logger.info({ msg: `Server listening on port ${PORT}` });
        resolve();
      }),
    );

    const game = makeGame(socketServer);

    await game.start();
  } catch (error) {
    Logger.error({
      msg: 'An error ocurred and closed the app',
      error: error,
    });
  }
})();
