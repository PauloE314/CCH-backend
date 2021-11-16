import TListener from './TListener';

const disconnect: TListener = async (io, socket, storage) => {
  const player = await storage.get('players', socket.id);
  const party = await storage.get('parties', player?.partyId || '');

  if (party) {
    const remaining = await party.players(storage);

    if (remaining.length > 1) party.sendToAll(io, 'player-leave', player);
    else await storage.remove('parties', party.id);
  }

  await storage.remove('players', socket.id);
};

export default disconnect;
