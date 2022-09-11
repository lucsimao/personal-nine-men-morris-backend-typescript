import { PinoAdapter } from './LoggerAdapter';

export const Logger = PinoAdapter.getInstance();
export * from './SocketInputAdapter';
export * from './SocketServerData';
