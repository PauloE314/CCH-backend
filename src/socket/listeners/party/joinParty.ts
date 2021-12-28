import { chatMessage } from '../chatMessage';
import { ErrorCodes, EventLabels } from '../../EventManager';
import { Listener, serializeParty, serializePlayer } from '../index';
import { leaveParty } from './leaveParty';
import { ready } from '../game/ready';
import { gameSettings } from '~/config/settings';

const joinParty: Listener = ({ player, socket, storage, eventManager }) => {
  socket.on(EventLabels.JoinParty, ({ partyId }) => {
    const party = storage.parties.get(partyId);

    if (!party) {
      return eventManager.error(ErrorCodes.inexistentParty);
    }

    if (party.players.length > gameSettings.maxPlayerAmount) {
      return eventManager.error(ErrorCodes.PartyTooLarge);
    }

    party.join(player);
    socket.join(party.id);

    eventManager.broadcast({
      label: EventLabels.PlayerJoin,
      payload: serializePlayer(player),
      to: party,
    });

    eventManager.send({
      label: EventLabels.JoinParty,
      payload: serializeParty(party),
    });

    eventManager.remove(EventLabels.CreateParty, EventLabels.JoinParty);
    eventManager.listen(leaveParty, chatMessage, ready);
  });
};

export { joinParty };
