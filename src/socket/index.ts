import { Server as SocketServer } from 'socket.io';

import connect from '~/socket/listeners/connect';

export default function setupWebSockets(io: SocketServer) {
  connect(io);
}
