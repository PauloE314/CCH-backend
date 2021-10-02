import { Server as SocketServer } from 'socket.io';

export default function setupWebSockets(io: SocketServer) {
  io.on('connect', () => {});
}
