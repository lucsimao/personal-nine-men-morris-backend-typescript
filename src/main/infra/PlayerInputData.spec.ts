import { Board } from '../../domain/entities/Board';
import { Player } from '../../domain/entities/Player';
import { PositionStatus } from '../../domain/enum/PositionStatus';
import {
  GameOverState,
  PlayerAddPieceState,
  PlayerMovePieceState,
  PlayerRemoveFoePieceState,
  PlayerTurnStartState,
  StartGameState,
} from '../../use-case/states';
import { State } from '../../use-case/states/enum/State';
import { Message } from '../config/Message';
import { PlayerInputData } from './PlayerInputData';
import { PlayerInputClient } from './protocols/PlayerInputClient';

const makeGameInfo = () => {
  const board = new Board();
  const player = new Player('player1', 'player1', PositionStatus.BLACK);
  const foe = new Player('player2', 'player2', PositionStatus.WHITE);
  board.add(20, PositionStatus.BLACK);

  return { board, player, foe };
};

const makePlayerInputClient = (): jest.Mocked<PlayerInputClient> => ({
  getInput: jest.fn().mockResolvedValue({ position: 20 }),
  getPlayer: jest.fn().mockResolvedValue('player name'),
  sendEventToAllPlayers: jest.fn().mockResolvedValue(null),
  sendEventToPlayer: jest.fn().mockResolvedValue(null),
});

const makeSut = () => {
  const playerInputClient = makePlayerInputClient();
  const sut = new PlayerInputData(playerInputClient);

  return { sut, playerInputClient };
};

describe('Player Data', () => {
  describe('When getting player', () => {
    test('should call player input', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayer();

      expect(playerInputClient.getPlayer).toBeCalledWith();
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

  describe('When updating board', () => {
    const state = new StartGameState(makeGameInfo());
    test('should call client', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.updateBoard(state);

      expect(playerInputClient.sendEventToAllPlayers).toBeCalledWith(
        'update-board',
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
        State.PLAYER_TURN_START,
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
        State.START_GAME,
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
        State.PLAYER_ADD_PIECE,
        Message.CHOOSE_PIECE(state.gameInfo.player.name),
      );
    });

    test('should call client get input', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerAddPiece(state);

      expect(playerInputClient.getInput).toBeCalledWith(State.PLAYER_ADD_PIECE);
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
        State.PLAYER_MOVE_PIECE,
        Message.CHOOSE_PIECE_TO_MOVE(state.gameInfo.player.name),
      );
    });

    test('should call client get input', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerMovePiece(state);

      expect(playerInputClient.getInput).toBeCalledWith(
        State.PLAYER_MOVE_PIECE,
      );
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
        State.PLAYER_REMOVE_FOE_PIECE,
        Message.CHOOSE_PIECE_TO_REMOVE(state.gameInfo.player.name),
      );
    });

    test('should call client get input', async () => {
      const { sut, playerInputClient } = makeSut();

      await sut.getPlayerRemoveFoePiece(state);

      expect(playerInputClient.getInput).toBeCalledWith(
        State.PLAYER_REMOVE_FOE_PIECE,
      );
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
        State.GAME_OVER,
        Message.GAME_OVER(state.gameInfo.player.name),
      );
      expect(playerInputClient.sendEventToAllPlayers).toBeCalledWith(
        State.GAME_OVER,
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