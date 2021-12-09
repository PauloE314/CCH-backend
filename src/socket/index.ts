import { Server as SocketServer } from 'socket.io';

import { GameStorage } from './GameStorage';
import { Player } from './models/Player';
import { getUsername } from './helpers';

import { disconnect } from './listeners/disconnect';
import { EventManager } from './EventManager';
import { nameValidation } from './middlewares/nameValidation';
import { createParty } from './listeners/createParty';
import { joinParty } from './listeners/joinParty';

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

    storage.players.store(player);
    eventManager.listen(disconnect, createParty, joinParty);
  });
}
