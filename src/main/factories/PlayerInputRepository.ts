import { Server } from 'socket.io';

import { Logger } from '../adapters';
import { PlayerInputData } from '../infra/PlayerInputData';
import { makeInputClient } from './InputClient';

export const makePlayerInputRepository = (server: Server) => {
  const inputClient = makeInputClient(server);
  const result = new PlayerInputData(inputClient, Logger);

  return result;
};
