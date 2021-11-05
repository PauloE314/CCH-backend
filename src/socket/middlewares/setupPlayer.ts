import { Socket } from 'socket.io';
import errorCodes from '~/config/errorCodes';
import Player from '../models/Player';
import { ISocketStorage } from '../storage/ISocketStorage';

export default function setupPlayer(
  socket: Socket,
  storage: ISocketStorage,
  next: Function
) {
  const { username } = socket.handshake.query;

  if (!username) next(new Error(`${errorCodes.invalidData}`));
  else {
    const playerName = Array.isArray(username) ? username[0] : username;
    storage.store('players', new Player(socket.id, playerName));
    next();
  }
}
