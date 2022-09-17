import { Server } from 'socket.io';

import { PlayerInputData } from '../infra/PlayerInputData';
import { Logger } from '../infra/protocols/Logger';
import { makeInputClient } from './InputClient';

export const makePlayerInputRepository = (server: Server, logger: Logger) => {
  const inputClient = makeInputClient(server);
  const result = new PlayerInputData(inputClient, logger);

  return result;
};
