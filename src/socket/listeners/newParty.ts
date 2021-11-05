import errorCodes from '~/config/errorCodes';
import Party from '../models/Party';
import TListener from './TListener';

const newParty: TListener = (_io, socket, storage) => {
  const player = storage.get('players', socket.id);

  if (!player) return;

  if (!player.partyId) {
    const party = new Party();
    storage.store('parties', party);

    player.partyId = party.id;
    socket.join(party.id);
    socket.emit('party-id', party.id);
  } else {
    socket.emit('error', errorCodes.inParty);
  }
};

export default newParty;
