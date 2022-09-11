import { State } from './enum/State';
import { PlayerTurnStartState } from './index';
import { GameInfo, GameState } from './protocols';

export class StartGameState extends GameState<void> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.START_GAME);
  }

  public async exec(interaction: () => void): Promise<GameState> {
    await interaction();

    return new PlayerTurnStartState(this.gameInfo);
  }
}
