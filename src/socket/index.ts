import { Server as SocketServer } from 'socket.io';

import setupPlayer from './middlewares/setupPlayer';

import { ISocketStorage } from './storage/ISocketStorage';
import newPlayer from './listeners/newPlayer';
import disconnect from './listeners/disconnect';
import newParty from './listeners/newParty';
import joinParty from './listeners/joinParty';
import chatMessage from './listeners/chatMessage';

export default function setupWebSockets(
  io: SocketServer,
  storage: ISocketStorage
) {
  storage.clearAll();

  io.use((socket, next) => setupPlayer(socket, storage, next));

  io.on('connection', socket => {
    socket.on('new-player', data => newPlayer(io, socket, storage, data));
    socket.on('disconnect', data => disconnect(io, socket, storage, data));
    socket.on('new-party', data => newParty(io, socket, storage, data));
    socket.on('join-party', data => joinParty(io, socket, storage, data));
    socket.on('chat-message', data => chatMessage(io, socket, storage, data));
  });
}
