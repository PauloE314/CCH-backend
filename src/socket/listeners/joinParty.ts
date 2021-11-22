import { errorCodes, gameSettings } from '~/config/settings';
import TListener from './TListener';

const { maxPlayerAmount } = gameSettings;

const joinParty: TListener = async (io, socket, storage, { partyId }) => {
  const player = await storage.get('players', socket.id);
  const party = await storage.get('parties', partyId);

  if (!player) return;

  if (!party) {
    socket.emit('error', errorCodes.inexistentParty);
    return;
  }

  if (player.partyId) {
    socket.emit('error', errorCodes.inParty);
    return;
  }

  const playerAmount = (await party.players(storage)).length;
  if (playerAmount > maxPlayerAmount) {
    socket.emit('error', errorCodes.PartyTooLarge);
    return;
  }

  player.partyId = party.id;
  party.playerIds.push(player.id);
  socket.join(party.id);
  socket.emit('party-id', party.id);

  const data = {
    ownerId: party.ownerId,
    allPlayers: await party.players(storage),
    player,
  };

  party.sendToAll(io, 'player-join', data);
};

export default joinParty;
