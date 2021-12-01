import { Server, Socket } from 'socket.io';
import { GameStorage } from '../storage';

type MiddlewareContext = {
  io: Server;
  storage: GameStorage;
  socket: Socket;
};

type Middleware = (
  data: MiddlewareContext,
  next: (error?: Error) => void
) => void;

export { MiddlewareContext, Middleware };
