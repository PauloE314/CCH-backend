import { joinParty } from './joinParty';
import { createParty } from './createParty';
import { EventLabels } from '../../EventManager';
import { Listener, serializeParty, serializePlayer } from '../index';

const leaveParty: Listener = ({ socket, player, eventManager, storage }) => {
  socket.on(EventLabels.LeaveParty, () => {
    const party = storage.parties.get(player.partyId);

    if (party) {
      player.partyId = '';
      socket.leave(party.id);

      party.players = party.players.filter(({ id }) => id !== player.id);

      if (party.players.length === 0) storage.parties.remove(party);
      else
        eventManager.broadcast({
          label: EventLabels.LeaveParty,
          to: party,
          payload: {
            player: serializePlayer(player),
            party: serializeParty(party),
          },
        });

      eventManager.remove(
        EventLabels.ChatMessage,
        EventLabels.LeaveParty,
        EventLabels.Ready
      );
      eventManager.listen(joinParty, createParty);
    }
  });
};

export { leaveParty };
