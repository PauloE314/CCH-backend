import errorCodes from '~/config/errorCodes';
import TListener from './TListener';

const joinParty: TListener = (io, socket, storage, { partyId }) => {
  const player = storage.get('players', socket.id);
  const party = storage.get('parties', partyId);

  if (!player.partyId && party) {
    const partyPlayers = party.players(storage);

    socket.join(party.id);
    socket.emit('party-id', party.id);
    player.partyId = party.id;
    party.sendToAll(io, 'player-join', partyPlayers);
  } else {
    const errorCode = !party ? errorCodes.inexistentParty : errorCodes.inParty;
    socket.emit('error', errorCode);
  }
};

export default joinParty;
