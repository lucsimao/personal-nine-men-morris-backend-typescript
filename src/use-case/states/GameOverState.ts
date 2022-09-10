import { State } from './enum/State';
import { PlayerTurnStart } from './index';
import { GameInfo, GameState } from './protocols';

export class GameOverState extends GameState<void> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.GAME_OVER);
  }

  public async exec(interaction: () => void): Promise<GameState> {
    await interaction();

    return new PlayerTurnStart(this.gameInfo);
  }
}
