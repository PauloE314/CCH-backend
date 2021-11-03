import TListener from './TListener';

const sendMessage: TListener = (_io, socket, storage, { message }) => {
  const player = storage.get('players', socket.id);
  const party = storage.get('parties', player?.id || '');

  if (!player || !party) return;

  party.sendToAllExcept(socket, 'message', message);
};

export default sendMessage;
