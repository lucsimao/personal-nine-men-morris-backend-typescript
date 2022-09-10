import { State } from './enum/State';
import { PlayerMovePieceState, PlayerAddPieceState } from './index';
import { GameInfo, GameState } from './protocols';

export class PlayerTurnStart extends GameState<void> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.PLAYER_TURN_START);
  }

  public async exec(interaction: () => void): Promise<GameState> {
    await interaction();
    const hasPieceInHand = this.gameInfo.player.piecesInHand > 0;

    if (hasPieceInHand) {
      return new PlayerAddPieceState(this.gameInfo);
    }
    return new PlayerMovePieceState(this.gameInfo);
  }
}
