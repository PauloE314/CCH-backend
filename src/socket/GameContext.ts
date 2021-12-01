import { Server, Socket } from 'socket.io';
import { EventManager } from './Events';
import { Player } from './models/Player';
import { GameStorage } from './storage';

type GameContext = {
  io: Server;
  eventManager: EventManager;
  player: Player;
  storage: GameStorage;
  socket: Socket;
};

export { GameContext };
