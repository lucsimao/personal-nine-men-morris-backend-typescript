import { State } from '../enum/State';
import { GameInfo } from './GameInfo';

export abstract class GameState<T = unknown> {
  constructor(
    private readonly _gameInfo: GameInfo,
    private readonly _name: State,
  ) {}

  public abstract exec(
    _interaction: () => T,
  ): Promise<GameState<unknown> | null>;

  get name() {
    return this._name;
  }

  get gameInfo() {
    return this._gameInfo;
  }
}
