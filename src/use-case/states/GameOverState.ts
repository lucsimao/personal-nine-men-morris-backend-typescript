import { State } from './enum/State';
import { GameInfo, GameState } from './protocols';

export class GameOverState extends GameState<void> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.GAME_OVER);
  }

  public async exec(interaction: () => void): Promise<GameState | null> {
    await interaction();

    return null;
  }
}
