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
  socket.join(party.id);
  socket.emit('party-id', party.id);
  party.sendToAll(io, 'player-join', await party.players(storage));
};

export default joinParty;
