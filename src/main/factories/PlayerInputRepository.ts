import { Server } from 'socket.io';

import { PlayerInputData } from '../infra/PlayerInputData';
import { makeInputClient } from './InputClient';

export const makePlayerInputRepository = (server: Server) => {
  const inputClient = makeInputClient(server);
  const result = new PlayerInputData(inputClient);

  return result;
};
