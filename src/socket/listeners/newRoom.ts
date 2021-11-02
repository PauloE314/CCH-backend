import { Server, Socket } from 'socket.io';
import errorCodes from '~/config/errorCodes';
import { generateRandomString } from '~/utils';
import { ISocketStorage } from '../storage/ISocketStorage';

export default function newRoom(
  io: Server,
  socket: Socket,
  storage: ISocketStorage
) {
  const player = storage.get('players', socket.id);

  if (player) {
    if (!player.roomId) {
      const roomId = generateRandomString(6);

      player.roomId = roomId;
      socket.join(roomId);
      socket.emit('room-id', roomId);
    } else {
      socket.emit('error', errorCodes.inRoom);
    }
  }
}
