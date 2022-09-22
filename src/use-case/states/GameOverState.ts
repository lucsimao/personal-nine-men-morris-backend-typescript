import { State } from '../../domain/state/enum/State';
import { GameInfo } from '../../domain/state/GameInfo';
import { GameState } from '../../domain/state/GameState';

export class GameOverState extends GameState<void> {
  constructor(gameInfoInfo: GameInfo) {
    super(gameInfoInfo, State.GAME_OVER);
  }

  public async exec(interaction: () => void): Promise<GameState | null> {
    await interaction();

    return null;
  }
}
