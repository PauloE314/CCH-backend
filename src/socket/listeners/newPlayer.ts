import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import Player from '~/socket/game/Player';

export default function newPlayer(
  _io: Server,
  _socket: Socket,
  storage: ISocketStorage,
  { username }: any
) {
  const player = new Player(username);
  storage.store('players', player);
}
