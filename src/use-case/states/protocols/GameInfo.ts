import { Board } from '../../../domain/entities/Board';
import { Player } from '../../../domain/entities/Player';

export interface GameInfo {
  board: Board;
  player: Player;
  foe: Player;
}
