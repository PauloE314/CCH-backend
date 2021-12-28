import { EventLabels } from '../../EventManager';
import { Listener, serializePlayer } from '../index';

const ready: Listener = ({ socket, player, eventManager, storage }) => {
  socket.on(EventLabels.Ready, () => {
    const party = storage.parties.get(player.id);
    party.setReady(player);

    if (party.allReady()) {
      console.log('READY');
    }

    eventManager.broadcast({
      label: EventLabels.Ready,
      payload: { player: serializePlayer(player) },
      to: player.partyId,
    });
  });
};

export { ready };
