import { Server, Socket } from 'socket.io';
import { GameEvent } from './GameEvent';
import TListener from './listeners/TListener';
import { ISocketStorage } from './storage/ISocketStorage';

type GameSocket = {
  io: Server;
  socket: Socket;
  storage: ISocketStorage;
};

type Event<T> = {
  type: GameEvent;
  topic?: string;
  payload?: T;
};

type Listener = (...listeners: TListener[]) => void;
type Emitter = (...events: Event<any>[]) => void;

type GamePubSub = {
  listen: Listener;
  emit: Emitter;
};

const makeListener =
  (gameSocket: GameSocket): Listener =>
  (...listeners) => {
    listeners.forEach(listener => listener(gameSocket));
  };

const makeEmitter =
  ({ socket }: GameSocket): Emitter =>
  (...events: Event<any>[]) => {
    events.forEach(event =>
      event.topic
        ? socket.broadcast.to(event.topic).emit(event.type, event)
        : socket.emit(event.type, event)
    );
  };

export { GameSocket, GamePubSub, Listener, makeListener, makeEmitter };
