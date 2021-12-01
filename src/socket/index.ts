import { Server as SocketServer } from 'socket.io';

import { GameStorage } from './storage';
import { Player } from './models/Player';
import { getUsername } from './helpers/socket';

import { disconnect } from './listeners/disconnect';
import { EventManager } from './Events';
import { nameValidation } from './middlewares/nameValidation';

export default async function setupWebSockets(
  io: SocketServer,
  storage: GameStorage
) {
  storage.drop();

  io.use((socket, next) => nameValidation({ io, socket, storage }, next));

  io.on('connection', socket => {
    const player = new Player(socket.id, getUsername(socket));
    const eventManager = new EventManager({
      io,
      player,
      socket,
      storage,
    });

    eventManager.listen(disconnect);
  });
}
