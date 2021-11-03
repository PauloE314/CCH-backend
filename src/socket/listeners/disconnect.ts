import TListener from './TListener';

const disconnect: TListener = (io, socket, storage) => {
  const player = storage.get('players', socket.id);
  const party = storage.get('parties', player.partyId);

  if (party) {
    const remaining = party.players(storage);

    if (remaining.length > 1) party.sendToAll(io, 'player-leave', player);
    else storage.remove('parties', party.id);
  }

  storage.remove('players', socket.id);
};

export default disconnect;
