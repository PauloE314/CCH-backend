import { Server, Socket } from 'socket.io';
import errorCodes from '~/config/errorCodes';
import Party from '../game/Party';
import { ISocketStorage } from '../storage/ISocketStorage';

export default function newParty(
  _io: Server,
  socket: Socket,
  storage: ISocketStorage
) {
  const player = storage.get('players', socket.id);

  if (!player.partyId) {
    const party = new Party();
    storage.store('parties', party);

    player.partyId = party.id;
    socket.join(party.id);
    socket.emit('party-id', party.id);
  } else {
    socket.emit('error', errorCodes.inParty);
  }
}
