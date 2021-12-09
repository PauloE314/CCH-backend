import { EventLabels } from '../EventManager';
import { Listener } from './index';

const chatMessage: Listener = ({ socket, player, eventManager }) => {
  socket.on(EventLabels.ChatMessage, ({ message }) => {
    eventManager.broadcast({
      label: EventLabels.ChatMessage,
      payload: { message },
      to: player.partyId,
    });
  });
};

export { chatMessage };
