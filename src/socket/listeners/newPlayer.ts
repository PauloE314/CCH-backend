import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import Player from '~/socket/game/Player';
import errorCodes from '~/config/errorCodes';

export default function newPlayer(
  _io: Server,
  socket: Socket,
  storage: ISocketStorage,
  { username }: any
) {
  if (!username) socket.emit('error', errorCodes.invalidData);
  else storage.store('players', new Player(socket.id, username));
}
