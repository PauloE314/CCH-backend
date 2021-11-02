import { Server as SocketServer } from 'socket.io';

import newPlayer from '~/socket/listeners/newPlayer';
import disconnect from '~/socket/listeners/disconnect';
import { ISocketStorage } from './storage/ISocketStorage';
import newParty from './listeners/newParty';
import joinParty from './listeners/joinParty';

export default function setupWebSockets(
  io: SocketServer,
  storage: ISocketStorage
) {
  storage.clearAll();

  io.on('connection', socket => {
    socket.on('new-player', data => newPlayer(io, socket, storage, data));
    socket.on('disconnect', () => disconnect(io, socket, storage));
    socket.on('new-party', () => newParty(io, socket, storage));
    socket.on('join-party', data => joinParty(io, socket, storage, data));
  });
}
