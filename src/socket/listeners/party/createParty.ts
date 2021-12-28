import { Party } from '../../models/Party';
import { EventLabels } from '../../EventManager';
import { Listener } from '../index';
import { leaveParty } from './leaveParty';
import { chatMessage } from '../chatMessage';

const createParty: Listener = ({ player, socket, storage, eventManager }) => {
  socket.on(EventLabels.CreateParty, () => {
    const party = new Party();
    party.players.push(player);
    storage.parties.store(party);

    player.partyId = party.id;
    socket.join(party.id);
    eventManager.send({
      label: EventLabels.CreateParty,
      payload: { partyId: party.id },
    });
    eventManager.remove(EventLabels.CreateParty, EventLabels.JoinParty);
    eventManager.listen(leaveParty, chatMessage);
  });
};

export { createParty };
