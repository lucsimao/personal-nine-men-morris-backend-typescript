import { State } from './enum/State';
import { GameOverState, PlayerTurnStart } from './index';
import { AddInteractionResult, GameInfo, GameState } from './protocols';

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
    return new PlayerTurnStart({
      ...this.gameInfo,
      player: this.gameInfo.foe,
      foe: this.gameInfo.player,
    });
  }
}
