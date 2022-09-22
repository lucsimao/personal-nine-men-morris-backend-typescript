import { State } from '../../domain/state/enum/State';
import { GameInfo } from '../../domain/state/GameInfo';
import { GameState } from '../../domain/state/GameState';
import { GameOverState, PlayerTurnStartState } from './index';
import { AddInteractionResult } from './protocols/AddInteractionResult';

export class PlayerRemoveFoePieceState extends GameState<AddInteractionResult> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.PLAYER_REMOVE_FOE_PIECE);
  }

  public async exec(
    interaction: () => AddInteractionResult,
  ): Promise<GameState<unknown>> {
    const { position } = await interaction();

    this.gameInfo.board.remove(position, this.gameInfo.player.color);
    this.gameInfo.foe.remove();

    const IsGameOver = this.gameInfo.foe.gamePieces < 3;
    if (IsGameOver) {
      return new GameOverState(this.gameInfo);
    }
    return new PlayerTurnStartState({
      ...this.gameInfo,
      player: this.gameInfo.foe,
      foe: this.gameInfo.player,
    });
  }
}
