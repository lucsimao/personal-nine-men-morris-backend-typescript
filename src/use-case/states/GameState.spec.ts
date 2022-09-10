import { GameOverState } from '.';
import {
  PlayerAddPieceState,
  StartGameState,
  PlayerMovePieceState,
  PlayerRemoveFoePieceState,
} from '.';
import { Board } from '../../domain/entities/Board';
import { Player } from '../../domain/entities/Player';
import { PositionStatus } from '../../domain/enum/PositionStatus';
import { PlayerTurnStart } from './PlayerTurnStart';

const makeSut = () => {
  const player1 = new Player('id', 'player 1', PositionStatus.BLACK);
  const player2 = new Player('id', 'player 2', PositionStatus.WHITE);
  const board = new Board();

  const sut = new StartGameState({
    board: board,
    player: player1,
    foe: player2,
  });

  return { sut, player1: player1, player2: player2, board: board };
};

describe('GameState', () => {
  test('should finish game with success', async () => {
    const { sut, board, player1, player2 } = makeSut();

    const addPiecePlayer = async (position: number, player: Player) => {
      const player1AddPiece = await state.exec(() => ({}));
      expect(player1AddPiece).toBeInstanceOf(PlayerAddPieceState);

      const player2Turn = await player1AddPiece.exec(() => ({
        position,
      }));
      expect(board.getStatusInPosition(position)).toBe(player.color);

      state = player2Turn;
      return state;
    };

    const movePiecePlayer = async (
      position: number,
      targetPosition: number,
      player: Player,
    ) => {
      const player1AddPiece = await state.exec(() => ({}));
      expect(player1AddPiece).toBeInstanceOf(PlayerMovePieceState);

      const player2Turn = await player1AddPiece.exec(() => ({
        position,
        targetPosition,
      }));
      expect(board.getStatusInPosition(position)).toBe(PositionStatus.VOID);
      expect(board.getStatusInPosition(targetPosition)).toBe(player.color);

      state = player2Turn;
      return state;
    };

    const removePiecePlayer = async (position: number) => {
      const playerTurn = await state.exec(() => ({
        position,
      }));

      expect(board.getStatusInPosition(position)).toBe(PositionStatus.VOID);

      state = playerTurn;
    };

    const playerTurn = await sut.exec(() => ({}));
    let state = playerTurn;

    expect(playerTurn).toBeInstanceOf(PlayerTurnStart);
    await addPiecePlayer(1, player1);
    await addPiecePlayer(2, player2);
    await addPiecePlayer(4, player1);
    await addPiecePlayer(3, player2);
    await addPiecePlayer(6, player1);

    expect(state).toBeInstanceOf(PlayerRemoveFoePieceState);
    await removePiecePlayer(2);
    await addPiecePlayer(2, player2);
    await addPiecePlayer(8, player1);
    await addPiecePlayer(18, player2);
    await addPiecePlayer(7, player1);

    expect(state).toBeInstanceOf(PlayerRemoveFoePieceState);
    await removePiecePlayer(3);
    await addPiecePlayer(12, player2);
    await addPiecePlayer(3, player1);
    await addPiecePlayer(23, player2);
    await addPiecePlayer(5, player1);

    expect(state).toBeInstanceOf(PlayerRemoveFoePieceState);
    await removePiecePlayer(2);
    await addPiecePlayer(19, player2);
    await addPiecePlayer(2, player1);

    expect(state).toBeInstanceOf(PlayerRemoveFoePieceState);
    await removePiecePlayer(19);
    await addPiecePlayer(19, player2);
    await addPiecePlayer(13, player1);
    await addPiecePlayer(24, player2);

    await movePiecePlayer(5, 14, player1);
    await movePiecePlayer(23, 21, player2);
    await movePiecePlayer(14, 5, player1);

    expect(state).toBeInstanceOf(PlayerRemoveFoePieceState);
    await removePiecePlayer(21);
    await movePiecePlayer(19, 20, player2);
    await movePiecePlayer(5, 14, player1);
    await movePiecePlayer(20, 19, player2);
    await movePiecePlayer(14, 5, player1);

    expect(state).toBeInstanceOf(PlayerRemoveFoePieceState);
    await removePiecePlayer(19);
    await movePiecePlayer(18, 17, player2);
    await movePiecePlayer(5, 14, player1);
    await movePiecePlayer(17, 18, player2);
    await movePiecePlayer(14, 5, player1);

    expect(state).toBeInstanceOf(PlayerRemoveFoePieceState);
    await removePiecePlayer(24);
    expect(state).toBeInstanceOf(GameOverState);
  });
});
