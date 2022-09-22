import { State } from '../../domain/state/enum/State';
import { GameInfo } from '../../domain/state/GameInfo';
import { GameState } from '../../domain/state/GameState';
import { PlayerTurnStartState } from './index';

export class StartGameState extends GameState<void> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.START_GAME);
  }

  public async exec(interaction: () => void): Promise<GameState> {
    await interaction();

    return new PlayerTurnStartState(this.gameInfo);
  }
}
