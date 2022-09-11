import { PlayerResult } from '../../../presentation/protocols/PlayerInputRepository';
import { AddInteractionResult } from '../../../use-case/states/protocols';

export interface PlayerInputClient {
  sendEventToAllPlayers(eventName: string, message: unknown): Promise<void>;
  getPlayer(): Promise<PlayerResult>;
  getInput(eventName: string): Promise<AddInteractionResult>;
  sendEventToPlayer(eventName: string, message: unknown): Promise<void>;
}
