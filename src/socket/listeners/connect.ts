import { Server as SocketServer } from 'socket.io';

export default function connect(io: SocketServer) {
  io.on('connect', () => {});
}
