import { Server, Socket } from 'socket.io';
import errorCodes from '~/config/errorCodes';
import Party from '../game/Party';
import Player from '../game/Player';
import { ISocketStorage } from '../storage/ISocketStorage';

export default function joinParty(
  io: Server,
  socket: Socket,
  storage: ISocketStorage,
  { partyId }: any
) {
  const player: Player = storage.get('players', socket.id);

  if (player) {
    const party: Party = storage.get('parties', partyId);

    if (!player.partyId && party) {
      const partyPlayers = party.players(storage);

      socket.join(party.id);
      player.partyId = party.id;
      party.sendToAll(io, 'player-join', partyPlayers);
    } else {
      const errorCode = !party
        ? errorCodes.inexistentParty
        : errorCodes.inParty;

      socket.emit('error', errorCode);
    }
  }
}
