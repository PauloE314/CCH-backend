import { EventLabels } from '../EventManager';
import { Listener, serializePlayer } from './index';

const chatMessage: Listener = ({ socket, player, eventManager }) => {
  socket.on(EventLabels.ChatMessage, ({ message }) => {
    eventManager.broadcast({
      label: EventLabels.ChatMessage,
      payload: { player: serializePlayer(player), message },
      to: player.partyId,
    });
  });
};

export { chatMessage };
