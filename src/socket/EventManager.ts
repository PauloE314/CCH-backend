import { Listener } from './listeners';
import { GameContext } from './GameContext';

enum EventLabels {
  CreateParty = 'create-party',
  Ready = 'ready',
  JoinParty = 'join-party',
  Disconnect = 'disconnect',
  ChatMessage = 'chat-message',
  LeaveParty = 'leave-party',
  PlayerJoin = 'player-join',
  Error = 'error',
}

enum ErrorCodes {
  invalidData = 1,
  inParty = 2,
  inexistentParty = 3,
  notInParty = 4,
  PartyTooLarge = 5,
}

type EmitDestiny = { id: string } | string;

type Event = {
  label: EventLabels;
  payload?: any;
  to?: EmitDestiny;
};

class EventManager {
  private context: GameContext;

  constructor(data: Omit<GameContext, 'eventManager'>) {
    this.context = { ...data, eventManager: this };
  }

  public listen(...listeners: Listener[]) {
    listeners.forEach(listener => listener(this.context));
  }

  public remove(...keys: EventLabels[]) {
    keys.forEach(key => this.context.socket.removeAllListeners(key));
  }

  public send({ label, payload, to }: Event) {
    const destiny = typeof to === 'string' ? to : to?.id;

    if (destiny) this.context.io.to(destiny).emit(label, payload);
    else this.context.socket.emit(label, payload);
  }

  public broadcast(event: Event & { to: EmitDestiny }) {
    const destiny = typeof event.to === 'string' ? event.to : event.to.id;
    this.context.socket.broadcast.to(destiny).emit(event.label, event.payload);
  }

  public error(code: ErrorCodes) {
    this.send({ label: EventLabels.Error, payload: { code } });
  }
}

export { Event, EventLabels, ErrorCodes, EventManager };
