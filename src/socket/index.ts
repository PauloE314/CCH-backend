import { Server as SocketServer } from 'socket.io';

import { ISocketStorage } from './storage/ISocketStorage';
import newPlayer from './listeners/newPlayer';
import disconnect from './listeners/disconnect';
import newParty from './listeners/newParty';
import joinParty from './listeners/joinParty';

export default function setupWebSockets(
  io: SocketServer,
  storage: ISocketStorage
) {
  storage.clearAll();

  io.on('connection', socket => {
    socket.on('new-player', data => newPlayer(io, socket, storage, data));
    socket.on('disconnect', data => disconnect(io, socket, storage, data));
    socket.on('new-party', data => newParty(io, socket, storage, data));
    socket.on('join-party', data => joinParty(io, socket, storage, data));
  });
}
