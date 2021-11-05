import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '../storage/ISocketStorage';

type TMiddleware = (
  io: Server,
  socket: Socket,
  storage: ISocketStorage,
  next: Function
) => any;

export default TMiddleware;
