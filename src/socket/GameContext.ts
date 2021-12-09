import { Server, Socket } from 'socket.io';
import { EventManager } from './EventManager';
import { Player } from './models/Player';
import { GameStorage } from './GameStorage';

type GameContext = {
  io: Server;
  eventManager: EventManager;
  player: Player;
  storage: GameStorage;
  socket: Socket;
};

export { GameContext };
