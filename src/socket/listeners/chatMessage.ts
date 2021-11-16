import { errorCodes } from '~/config/settings';
import TListener from './TListener';

const chatMessage: TListener = async (_io, socket, storage, { message }) => {
  const player = await storage.get('players', socket.id);
  const party = await storage.get('parties', player?.id || '');

  if (!player) return;

  if (party) party.sendToAllExcept(socket, 'chat-message', message);
  else socket.emit('error', errorCodes.notInParty);
};

export default chatMessage;
