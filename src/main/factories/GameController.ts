import { Server } from 'socket.io';

import { GameController } from '../../presentation/controllers/GameController';
import { Logger } from '../infra/protocols/Logger';
import { makePlayerInputRepository } from './PlayerInputRepository';

export const makeGame = (server: Server, logger: Logger) => {
  const playerInputRepository = makePlayerInputRepository(server, logger);
  const result = new GameController(playerInputRepository, logger);

  return result;
};
