import { Server } from 'socket.io';

import { PlayerInputData } from '../../use-case/services/PlayerInputData';
import { Logger } from '../../use-case/services/protocols/Logger';
import { makeInputClient } from './InputClient';

export const makePlayerService = (server: Server, logger: Logger) => {
  const inputClient = makeInputClient(server);
  const result = new PlayerInputData(inputClient, logger);

  return result;
};
