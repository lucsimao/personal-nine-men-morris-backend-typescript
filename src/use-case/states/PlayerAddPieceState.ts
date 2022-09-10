import { State } from './enum/State';
import { PlayerRemoveFoePieceState, PlayerTurnStart } from './index';
import { AddInteractionResult, GameInfo, GameState } from './protocols';

export class PlayerAddPieceState extends GameState<AddInteractionResult> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.PLAYER_ADD_PIECE);
  }

  public async exec(
    interaction: () => AddInteractionResult,
  ): Promise<GameState> {
    const { position } = await interaction();

    this.gameInfo.board.add(position, this.gameInfo.player.color);
    this.gameInfo.player.add();

    const hasPlayerMill = this.gameInfo.board.hasMill(position);
    if (hasPlayerMill) {
      return new PlayerRemoveFoePieceState(this.gameInfo);
    }
    return new PlayerTurnStart({
      ...this.gameInfo,
      player: this.gameInfo.foe,
      foe: this.gameInfo.player,
    });
  }
}
