import errorCodes from '~/config/errorCodes';
import Player from '../models/Player';
import TMiddleware from './TMiddleware';

const setupPlayer: TMiddleware = (_io, socket, storage, next) => {
  const { username } = socket.handshake.query;

  if (!username) next(new Error(`${errorCodes.invalidData}`));
  else {
    const playerName = Array.isArray(username) ? username[0] : username;
    storage.store('players', new Player(socket.id, playerName));
    next();
  }
};

export default setupPlayer;
