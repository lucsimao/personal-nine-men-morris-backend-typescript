import { Board } from '../../domain/entities/Board';
import { Player } from '../../domain/entities/Player';
import { PositionStatus } from '../../domain/enum/PositionStatus';
import { Message } from '../../main/config/Message';
import {
  GameOverState,
  PlayerAddPieceState,
  PlayerMovePieceState,
  PlayerRemoveFoePieceState,
  PlayerTurnStartState,
  StartGameState,
} from '../../use-case/states';
import { PlayerInputData } from './PlayerInputData';
import { Logger } from './protocols/Logger';
import { PlayerRepository } from './protocols/PlayerRepository';

const makeGameInfo = () => {
  const board = new Board();
  const player = new Player('player1', 'player1', PositionStatus.BLACK);
  const foe = new Player('player2', 'player2', PositionStatus.WHITE);
  board.add(20, PositionStatus.BLACK);

  return { board, player, foe };
};

const makeLogger = (): jest.Mocked<Logger> => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
});

const makePlayerInputClient = (): jest.Mocked<PlayerRepository> => ({
  getInput: jest.fn().mockResolvedValue({ position: 20 }),
  getPlayer: jest.fn().mockResolvedValue('player name'),
  sendEventToAllPlayers: jest.fn().mockResolvedValue(null),
  sendEventToPlayer: jest.fn().mockResolvedValue(null),
  setDefaultWatcherConnection: jest.fn().mockResolvedValue(null),
  clearPlayerListeners: jest.fn().mockResolvedValue(null),
});

const makeSut = () => {
  const playerInputClient = makePlayerInputClient();
  const logger = makeLogger();
  const sut = new PlayerInputData(playerInputClient, logger);

  return { sut, playerInputClient, logger };
};

describe('Player Data', () => {
  describe('When getting player', () => {
    test('should call player input', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayer();

      expect(playerInputClient.getPlayer).toBeCalledWith(expect.any(Function));
    });

    test('should call player input callback', async () => {
      const { sut, playerInputClient, logger } = makeSut();
      playerInputClient.getPlayer.mockImplementationOnce(async callback => {
        await callback('player name');
        return { id: '1', name: 'some name' };
      });

      await sut.getPlayer();

      expect(logger.info).toBeCalled();
    });

    describe('should return player', () => {
      test('when fetch player with success', async () => {
        const { sut } = makeSut();

        const result = await sut.getPlayer();

        expect(result).toEqual('player name');
      });
    });

    describe('should not return player', () => {
      test('when player fetch fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.getPlayer.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getPlayer();

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
    });
  });

  describe('When watching player connection', () => {
    test('should watch player', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.setWatcherPlayerConnection();

      expect(playerInputClient.setDefaultWatcherConnection).toBeCalledWith(
        expect.any(Function),
      );
    });

    test('should watch player callback', async () => {
      const { sut, playerInputClient, logger } = makeSut();
      playerInputClient.setDefaultWatcherConnection.mockImplementationOnce(
        async callback => {
          await callback('player name');
        },
      );

      await sut.setWatcherPlayerConnection();

      expect(logger.info).toBeCalled();
    });
  });

  describe('When updating board', () => {
    const state = new StartGameState(makeGameInfo());
    test('should call client', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.updateBoard(state);

      expect(playerInputClient.sendEventToAllPlayers).toBeCalledWith(
        { name: 'update-board' },
        state.gameInfo,
      );
    });

    describe('should not update board', () => {
      test('when client fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.sendEventToAllPlayers.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.updateBoard(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
    });
  });

  describe('When starting player turn', () => {
    const state = new PlayerTurnStartState(makeGameInfo());

    test('should call client send event', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerTurnStart(state);

      expect(playerInputClient.sendEventToAllPlayers).toBeCalledWith(
        state,
        Message.PLAYER_TURN(state.gameInfo.player.name),
      );
    });

    describe('should not start player turn', () => {
      test('when client send event fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.sendEventToAllPlayers.mockRejectedValueOnce(
          new Error('Any client error'),
        );

        const promise = sut.getPlayerTurnStart(state);

        await expect(promise).rejects.toThrow(new Error('Any client error'));
      });
    });
  });

  describe('When starting game', () => {
    const state = new StartGameState(makeGameInfo());
    test('should call client', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getStartGame(state);

      expect(playerInputClient.sendEventToAllPlayers).toBeCalledWith(
        state,
        Message.START_GAME,
      );
    });

    describe('should not start game', () => {
      test('when client fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.sendEventToAllPlayers.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getStartGame(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
    });
  });

  describe('When adding piece', () => {
    const state = new PlayerAddPieceState(makeGameInfo());
    test('should call client send event', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerAddPiece(state);

      expect(playerInputClient.sendEventToPlayer).toBeCalledWith(
        state,
        Message.CHOOSE_PIECE(state.gameInfo.player.name),
      );
    });

    test('should call client get input', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerAddPiece(state);

      expect(playerInputClient.getInput).toBeCalledWith(state);
    });
    describe('should add piece', () => {
      test('when fetch with success', async () => {
        const { sut } = makeSut();

        const result = await sut.getPlayerAddPiece(state);

        expect(result).toEqual({ position: 20 });
      });
    });

    describe('should not add piece', () => {
      test('when client get input fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.getInput.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getPlayerAddPiece(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
      test('when client send event fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.sendEventToPlayer.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getPlayerAddPiece(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
    });
  });

  describe('When moving piece', () => {
    const state = new PlayerMovePieceState(makeGameInfo());
    test('should call client send event', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerMovePiece(state);

      expect(playerInputClient.sendEventToPlayer).toBeCalledWith(
        state,
        Message.CHOOSE_PIECE_TO_MOVE(state.gameInfo.player.name),
      );
    });

    test('should call client get input', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerMovePiece(state);

      expect(playerInputClient.getInput).toBeCalledWith(state);
      expect(playerInputClient.getInput).toBeCalledTimes(2);
    });
    describe('should move piece', () => {
      test('when fetch with success', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.getInput
          .mockResolvedValueOnce({ position: 20 })
          .mockResolvedValueOnce({ position: 12 });

        const result = await sut.getPlayerMovePiece(state);

        expect(result).toEqual({ position: 20, targetPosition: 12 });
      });
    });

    describe('should not move piece', () => {
      test('when client get input fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.getInput.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getPlayerMovePiece(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
      test('when client send event fails', async () => {
        const { sut, playerInputClient } = makeSut();

        playerInputClient.sendEventToPlayer.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getPlayerMovePiece(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
    });
  });

  describe('When removing piece', () => {
    const state = new PlayerRemoveFoePieceState(makeGameInfo());
    test('should call client send event', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerRemoveFoePiece(state);

      expect(playerInputClient.sendEventToPlayer).toBeCalledWith(
        state,
        Message.CHOOSE_PIECE_TO_REMOVE(state.gameInfo.player.name),
      );
    });

    test('should call client get input', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerRemoveFoePiece(state);

      expect(playerInputClient.getInput).toBeCalledWith(state);
    });
    describe('should remove piece', () => {
      test('when fetch with success', async () => {
        const { sut } = makeSut();

        const result = await sut.getPlayerAddPiece(state);

        expect(result).toEqual({ position: 20 });
      });
    });

    describe('should not remove piece', () => {
      test('when client get input fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.getInput.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getPlayerRemoveFoePiece(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
      test('when client send event fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.sendEventToPlayer.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getPlayerRemoveFoePiece(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
    });
  });

  describe('When finishing game', () => {
    const state = new GameOverState(makeGameInfo());

    test('should call send event client', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getGameOver(state);

      expect(playerInputClient.sendEventToPlayer).toBeCalledWith(
        state,
        Message.GAME_OVER(state.gameInfo.player.name),
      );
      expect(playerInputClient.sendEventToAllPlayers).toBeCalledWith(
        state,
        state.gameInfo,
      );
    });

    describe('should not finish game', () => {
      test('when client send event fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.sendEventToAllPlayers.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getGameOver(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });

      test('when client send event to player fails', async () => {
        const { sut, playerInputClient } = makeSut();
        playerInputClient.sendEventToPlayer.mockRejectedValueOnce(
          new Error('Some client error'),
        );

        const promise = sut.getGameOver(state);

        await expect(promise).rejects.toThrow(new Error('Some client error'));
      });
    });
  });
});
