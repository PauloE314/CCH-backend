import { Server as SocketServer } from 'socket.io';
import {
  GamePubSub,
  GameSocket,
  makeEmitter,
  makeListener,
} from './GameSocket';

import { ISocketStorage } from './storage/ISocketStorage';

import setupPlayer from './middlewares/setupPlayer';
import disconnect from './listeners/disconnect';
import { GameEvent } from './GameEvent';

export default async function setupWebSockets(
  io: SocketServer,
  storage: ISocketStorage
) {
  storage.clearAll();

  io.use((socket, next) => setupPlayer(io, socket, storage, next));
  // io.use((socket, next) => setupParty(io, socket, storage, next));

  return new Promise<{
    gameSocket: GameSocket;
    pubSub: GamePubSub;
  }>(resolve => {
    io.on('connection', socket => {
      const gameSocket = { socket, io, storage };
      disconnect(gameSocket);

      resolve({
        gameSocket,
        pubSub: {
          listen: makeListener(gameSocket),
          emit: makeEmitter(gameSocket),
        },
      });
    });
  });
}

namespace GameWrapper {
  let pubSub: GamePubSub;
  let gameSocket: GameSocket;

  export const build = async (io: SocketServer, storage: ISocketStorage) => {
    const startup = await setupWebSockets(io, storage);

    pubSub = startup.pubSub;
    gameSocket = startup.gameSocket;
  };

  export const newGame = () => {
    const game = new Game(gameSocket, gameListen);
    // pubSub.listen(sendResponse);
    game.start();
  };

  export const joinParty = () => {
    pubSub.listen(joinParty, chatMessage);
  };

  export const newParty = () => {};
}

// -------------------------------------
