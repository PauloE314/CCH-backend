import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import Player from '~/socket/game/Player';

export default function newPlayer(
  _io: Server,
  socket: Socket,
  storage: ISocketStorage,
  { username }: any
) {
  storage.store('players', new Player(socket.id, username));
}
