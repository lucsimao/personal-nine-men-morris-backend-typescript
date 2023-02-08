import http from 'http';
import { Server } from 'socket.io';
import Client, { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { makeGame } from '../../main/factories/GameController';
import { Logger } from '../../use-case/services/protocols/Logger';

const PORT = 8888;

const makeServerSocket = async () => {
  const server = http.createServer();

  await new Promise<void>(resolve =>
    server.listen(PORT, () => {
      resolve();
    }),
  );

  const socketServer = new Server(server);

  return { server, socketServer };
};

const makeLogger = (): jest.Mocked<Logger> => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
});

const closeServices = async (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
  socketServer: Server,
  clients: Socket<DefaultEventsMap, DefaultEventsMap>[],
) => {
  await new Promise<void>(resolve => {
    for (const client of clients) {
      client.close();
    }
    resolve();
  });

  await new Promise<void>(resolve => {
    socketServer.close(() => {
      resolve();
    });
  });

  await new Promise<void>(resolve => {
    server.close(() => {
      resolve();
    });
  });
};

const makeSocketClient = () => {
  const socketClient = Client(`http://localhost:${PORT}/`);

  return socketClient;
};

const makeSut = async () => {
  const { socketServer, server } = await makeServerSocket();
  const logger = makeLogger();

  const sut = makeGame(socketServer, logger);

  return { sut, socketServer, server };
};

const sendEvent = (
  client: Socket<DefaultEventsMap, DefaultEventsMap>,
  event: string,
  value: unknown,
) => {
  client.emit(event, value);
};

describe('Game Test', () => {
  describe('when setting up game', () => {
    it('should receive connection when player connect', async () => {
      const { sut, socketServer, server } = await makeSut();

      const promise = sut.setupPlayers();
      const client = makeSocketClient();
      const client2 = makeSocketClient();

      const players = await promise;

      expect(players).toEqual({
        foe: {
          _color: 'White',
          _gamePieces: 9,
          _id: expect.any(String),
          _name: expect.any(String),
          _piecesInHand: 9,
        },
        player: {
          _color: 'Black',
          _gamePieces: 9,
          _id: expect.any(String),
          _name: expect.any(String),
          _piecesInHand: 9,
        },
      });
      await closeServices(server, socketServer, [client, client2]);
    });

    // it('should receive connection when player connect', async () => {
    //   const { sut, socketServer, server } = await makeSut();
    //   const promise = sut.setupPlayers();
    //   const client = makeSocketClient();
    //   const client2 = makeSocketClient();
    //   try {
    //     const players = await promise;
    //     void sut.start(players);

    //     sendEvent(client, 'add-piece', 3);
    //   } finally {
    //     await closeServices(server, socketServer, [client, client2]);
    //   }
    // });
  });
});
