import Player from '~/socket/models/Player';
import errorCodes from '~/config/errorCodes';
import TListener from './TListener';

const newPlayer: TListener = (_io, socket, storage, { username }) => {
  if (username) {
    storage.store('players', new Player(socket.id, username));
    socket.removeAllListeners('new-player');
  } else {
    socket.emit('error', errorCodes.invalidData);
  }
};

export default newPlayer;
