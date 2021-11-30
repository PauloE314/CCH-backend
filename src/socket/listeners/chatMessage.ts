import { errorCodes } from '~/config/settings';
import { GameEvent } from '../GameEvent';
import TListener from './TListener';

const chatMessage: TListener = ({ socket, storage }) =>
  socket.on(GameEvent.ChatMessage, async message => {
    const player = await storage.get('players', socket.id);
    const party = await storage.get('parties', player?.id || '');

    if (!player) return;

    if (party) party.sendToAllExcept(socket, GameEvent.ChatMessage, message);
    else socket.emit('error', errorCodes.notInParty);
  });

export default chatMessage;
