import { GameInfo } from './GameInfo';

export abstract class GameState<T = unknown> {
  constructor(
    protected readonly gameInfo: GameInfo,
    private readonly _name: string,
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
}
