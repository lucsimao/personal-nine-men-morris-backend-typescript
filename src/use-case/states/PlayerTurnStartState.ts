import { State } from '../../domain/state/enum/State';
import { GameInfo } from '../../domain/state/GameInfo';
import { GameState } from '../../domain/state/GameState';
import { PlayerMovePieceState, PlayerAddPieceState } from './index';

export class PlayerTurnStartState extends GameState<void> {
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
