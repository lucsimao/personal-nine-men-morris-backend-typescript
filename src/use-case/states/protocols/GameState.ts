import { State } from '../enum/State';
import { GameInfo } from './GameInfo';

export abstract class GameState<T = unknown> {
  constructor(
    private readonly _gameInfo: GameInfo,
    private readonly _name: State,
  ) {}

  public abstract exec(_interaction: () => T): Promise<GameState<unknown>>;

  get player() {
    return this.gameInfo.player;
  }

  get name() {
    return this._name;
  }

  get board() {
    return this.gameInfo.board;
  }

  get gameInfo() {
    return this._gameInfo;
  }
}
