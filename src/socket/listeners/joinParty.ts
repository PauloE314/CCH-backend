import { chatMessage } from './chatMessage';
import { ErrorCodes, EventLabels } from '../EventManager';
import { Listener, serializeParty } from './index';
import { leaveParty } from './leaveParty';

const joinParty: Listener = ({ player, socket, storage, eventManager }) => {
  socket.on(EventLabels.JoinParty, ({ partyId }) => {
    const party = storage.parties.get(partyId);

    if (!party) {
      return eventManager.error(ErrorCodes.inexistentParty);
    }

    player.partyId = party.id;
    party.players.push(player);
    socket.join(party.id);

    eventManager.broadcast({
      label: EventLabels.PlayerJoin,
      payload: player,
      to: party,
    });

    eventManager.send({
      label: EventLabels.JoinParty,
      payload: serializeParty(party),
    });

    eventManager.remove(EventLabels.CreateParty, EventLabels.JoinParty);
    eventManager.listen(leaveParty, chatMessage);
  });
};

export { joinParty };
