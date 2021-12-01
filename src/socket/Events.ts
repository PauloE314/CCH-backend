import { Listener } from './listeners';
import { GameContext } from './GameContext';

enum EventLabels {
  NewParty = 'new-party',
  JoinParty = 'join-party',
  Disconnect = 'disconnect',
  ChatMessage = 'chat-message',
  PlayerLeave = 'player-leave',
  PlayerJoin = 'player-join',
  PartyId = 'party-id',
  Error = 'error',
}

enum ErrorCodes {
  invalidData = 1,
  inParty = 2,
  inexistentParty = 3,
  notInParty = 4,
  PartyTooLarge = 5,
}

type Event = {
  label: EventLabels;
  payload?: any;
};

class EventManager {
  private context: GameContext;

  constructor(data: Omit<GameContext, 'eventManager'>) {
    this.context = { ...data, eventManager: this };
  }

  public listen(...listeners: Listener[]) {
    listeners.forEach(listener => listener(this.context));
  }

  public unListen(...keys: string[]) {
    keys.forEach(key => this.context.socket.removeAllListeners(key));
  }

  public emit(event: Event) {
    this.context.socket.emit(event.label, event.payload);
  }

  public error(code: ErrorCodes) {
    this.emit({ label: EventLabels.Error, payload: code });
  }
}

export { Event, EventLabels, ErrorCodes, EventManager };
