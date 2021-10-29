import { Server as SocketServer } from 'socket.io';

import newPlayer from '~/socket/listeners/newPlayer';
import disconnect from '~/socket/listeners/disconnect';
import SocketStorage from './storage/inMemoryStorage';

export default function setupWebSockets(io: SocketServer) {
  SocketStorage.clearAll();

  io.on('connection', socket => {
    socket.on('new-player', data => newPlayer(io, socket, SocketStorage, data));
    socket.on('disconnect', () => disconnect(io, socket, SocketStorage));
  });
}
