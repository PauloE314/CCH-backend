import { errorCodes } from '~/config/settings';
import Party from '../models/Party';
import TListener from './TListener';

const newParty: TListener = async (_io, socket, storage) => {
  const player = await storage.get('players', socket.id);

  if (!player) return;

  if (!player.partyId) {
    const party = new Party();
    await storage.store('parties', party);

    player.partyId = party.id;
    party.playerIds.push(player.id);
    socket.join(party.id);
    socket.emit('party-id', party.id);
  } else {
    socket.emit('error', errorCodes.inParty);
  }
};

export default newParty;
