import { Server, Socket } from 'socket.io';
import { EventManager } from '~/socket/EventManager';
import { GameContext } from '~/socket/GameContext';
import { Player } from '~/socket/models/Player';
import { GameStorage } from '~/socket/GameStorage';
import { ioFactory } from './io';
import { playerFactory } from './player';
import { socketFactory } from './socket';
import { storageFactory } from './storage';
import { eventManagerFactory } from './eventManager';

type GameContextFactoryParams = {
  io?: Server;
  eventManager?: EventManager;
  player?: Player;
  storage?: GameStorage;
  socket?: Socket;
};

const gameContextFactory = ({
  io,
  eventManager: _eventManager,
  player,
  storage,
  socket,
}: GameContextFactoryParams = {}): GameContext => {
  const ctx = {
    io: io || ioFactory(),
    player: player || playerFactory(),
    storage: storage || storageFactory(),
    socket: socket || socketFactory(),
  };

  const eventManager = _eventManager || eventManagerFactory(ctx);

  return {
    ...ctx,
    eventManager,
  };
};

export { gameContextFactory };
