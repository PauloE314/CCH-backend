import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';

export default function disconnect(
  _io: Server,
  socket: Socket,
  storage: ISocketStorage
) {
  storage.remove('players', socket.id);
}
