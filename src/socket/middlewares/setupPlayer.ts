import { errorCodes } from '~/config/settings';
import Player from '../models/Player';
import TMiddleware from './TMiddleware';

const setupPlayer: TMiddleware = async (_io, socket, storage, next) => {
  const { username } = socket.handshake.query;

  if (!username) next(new Error(`${errorCodes.invalidData}`));
  else {
    const playerName = Array.isArray(username) ? username[0] : username;
    await storage.store('players', new Player(socket.id, playerName));
    next();
  }
};

export default setupPlayer;
