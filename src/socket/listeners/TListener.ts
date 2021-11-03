import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '../storage/ISocketStorage';

type TListener = (
  io: Server,
  socket: Socket,
  storage: ISocketStorage,
  data: any
) => any;

export default TListener;
