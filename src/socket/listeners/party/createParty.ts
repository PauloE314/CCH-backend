import { Party } from '../../models/Party';
import { EventLabels } from '../../EventManager';
import { Listener } from '../index';
import { leaveParty } from './leaveParty';
import { chatMessage } from '../chatMessage';
import { ready } from '../game/ready';

const createParty: Listener = ({ player, socket, storage, eventManager }) => {
  socket.on(EventLabels.CreateParty, () => {
    const party = new Party();
    party.join(player);
    socket.join(party.id);

    storage.parties.store(party);
    eventManager.send({
      label: EventLabels.CreateParty,
      payload: { partyId: party.id },
    });
    eventManager.remove(EventLabels.CreateParty, EventLabels.JoinParty);
    eventManager.listen(leaveParty, chatMessage, ready);
  });
};

export { createParty };
