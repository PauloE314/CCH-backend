import errorCodes from '~/config/errorCodes';
import TListener from './TListener';

const joinParty: TListener = (io, socket, storage, { partyId }) => {
  const player = storage.get('players', socket.id);
  const party = storage.get('parties', partyId);

  if (!player) return;

  if (!player.partyId && party) {
    player.partyId = party.id;
    socket.join(party.id);
    socket.emit('party-id', party.id);

    party.sendToAll(io, 'player-join', party.players(storage));
  } else {
    const errorCode = !party ? errorCodes.inexistentParty : errorCodes.inParty;
    socket.emit('error', errorCode);
  }
};

export default joinParty;
