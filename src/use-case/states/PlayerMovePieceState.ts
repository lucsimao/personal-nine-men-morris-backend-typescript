import { State } from '../../domain/state/enum/State';
import { GameInfo } from '../../domain/state/GameInfo';
import { GameState } from '../../domain/state/GameState';
import { PlayerRemoveFoePieceState, PlayerTurnStartState } from './index';
import { MovementInteractionResult } from './protocols/MovementInteractionResult';

export class PlayerMovePieceState extends GameState<MovementInteractionResult> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.PLAYER_MOVE_PIECE);
  }

  public async exec(
    interaction: () => MovementInteractionResult,
  ): Promise<GameState> {
    const { position, targetPosition } = await interaction();

    this.gameInfo.board.move(
      position,
      targetPosition,
      this.gameInfo.player.color,
    );

    if (this.gameInfo.board.hasMill(targetPosition)) {
      return new PlayerRemoveFoePieceState(this.gameInfo);
    }
    return new PlayerTurnStartState({
      ...this.gameInfo,
      player: this.gameInfo.foe,
      foe: this.gameInfo.player,
    });
  }
}
