import { Server } from 'socket.io';

import { GameController } from '../../presentation/controllers/GameController';
import { makePlayerInputRepository } from './PlayerInputRepository';

export const makeGame = (server: Server) => {
  const playerInputRepository = makePlayerInputRepository(server);
  const result = new GameController(playerInputRepository);

  return result;
};
