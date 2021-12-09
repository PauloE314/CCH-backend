import { Socket, Server } from 'socket.io';
import { EventManager } from '~/socket/EventManager';
import { GameStorage } from '~/socket/GameStorage';
import { Player } from '~/socket/models/Player';
import { ioFactory } from './io';
import { playerFactory } from './player';
import { socketFactory } from './socket';
import { storageFactory } from './storage';

type EventManagerFactoryParams = {
  io?: Server;
  player?: Player;
  storage?: GameStorage;
  socket?: Socket;
};

const eventManagerFactory = ({
  io,
  player,
  storage,
  socket,
}: EventManagerFactoryParams = {}) => {
  const data = {
    io: io || ioFactory(),
    player: player || playerFactory(),
    storage: storage || storageFactory(),
    socket: socket || socketFactory(),
  };

  const eventManager = new EventManager(data);

  jest.spyOn(eventManager, 'remove');
  jest.spyOn(eventManager, 'listen');
  jest.spyOn(eventManager, 'broadcast');
  jest.spyOn(eventManager, 'send');
  jest.spyOn(eventManager, 'error');

  return eventManager;
};

export { eventManagerFactory };
