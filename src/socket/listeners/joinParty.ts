import { errorCodes, gameSettings } from '~/config/settings';
import TListener from './TListener';

const { maxPlayerAmount } = gameSettings;

const joinParty: TListener = (io, socket, storage, { partyId }) => {
  const player = storage.get('players', socket.id);
  const party = storage.get('parties', partyId);

  if (!player) return;

  if (!party) {
    socket.emit('error', errorCodes.inexistentParty);
    return;
  }

  if (player.partyId) {
    socket.emit('error', errorCodes.inParty);
    return;
  }

  const playerAmount = party.players(storage).length;
  if (playerAmount > maxPlayerAmount) {
    socket.emit('error', errorCodes.PartyTooLarge);
    return;
  }

  player.partyId = party.id;
  socket.join(party.id);
  socket.emit('party-id', party.id);
  party.sendToAll(io, 'player-join', party.players(storage));
};

export default joinParty;
