import { errorCodes } from '~/config/settings';
import { GameEvent } from '../GameEvent';
import Party from '../models/Party';
import TListener from './TListener';

const newParty: TListener = ({ socket, storage }) =>
  socket.on(GameEvent.NewParty, async () => {
    const player = await storage.get('players', socket.id);

    if (!player) return;

    if (!player.partyId) {
      const party = new Party();
      await storage.store('parties', party);

      player.partyId = party.id;
      party.playerIds.push(player.id);
      socket.join(party.id);
      socket.emit(GameEvent.PartyId, party.id);
    } else {
      socket.emit(GameEvent.Error, errorCodes.inParty);
    }
  });

export default newParty;
