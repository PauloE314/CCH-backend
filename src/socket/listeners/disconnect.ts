import TListener from './TListener';

const disconnect: TListener = async (io, socket, storage) => {
  const player = await storage.get('players', socket.id);
  const party = await storage.get('parties', player?.partyId || '');

  if (party && player) {
    if (party.playerIds.length > 1) {
      party.playerIds = party.playerIds.filter(id => id !== player.id);

      const data = {
        ownerId: party.ownerId,
        allPlayers: await party.players(storage),
        player,
      };

      party.sendToAll(io, 'player-leave', data);
    } else await storage.remove('parties', party.id);
  }

  await storage.remove('players', socket.id);
};

export default disconnect;
