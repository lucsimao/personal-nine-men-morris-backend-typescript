import { Board } from '../entities/Board';
import { Player } from '../entities/Player';

export interface GameInfo {
  board: Board;
  player: Player;
  foe: Player;
}
