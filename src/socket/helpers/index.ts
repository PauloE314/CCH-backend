import { Socket } from 'socket.io';
import { Party } from '~/socket/models/Party';

function getUsername(socket: Socket) {
  const queryUsername = socket.handshake.query.username;

  return Array.isArray(queryUsername)
    ? queryUsername[0]
    : String(queryUsername);
}

export { getUsername };
