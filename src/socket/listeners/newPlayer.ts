import Player from '~/socket/game/Player';
import errorCodes from '~/config/errorCodes';
import TListener from './TListener';

const newPlayer: TListener = (_io, socket, storage, { username }) => {
  if (!username) socket.emit('error', errorCodes.invalidData);
  else storage.store('players', new Player(socket.id, username));
};

export default newPlayer;
