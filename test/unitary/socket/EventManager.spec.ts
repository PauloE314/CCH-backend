import { ioFactory } from '~/../test/factories/io';
import { playerFactory } from '~/../test/factories/player';
import { socketFactory } from '~/../test/factories/socket';
import { storageFactory } from '~/../test/factories/storage';
import { ErrorCodes, EventLabels, EventManager } from '~/socket/EventManager';
import { GameContext } from '~/socket/GameContext';

describe('EventManager', () => {
  let eventManager: EventManager;
  let semiContextMock: Omit<GameContext, 'eventManager'>;
  let context: GameContext;

  beforeEach(() => {
    semiContextMock = {
      io: ioFactory(),
      socket: socketFactory(),
      player: playerFactory(),
      storage: storageFactory(),
    };

    eventManager = new EventManager(semiContextMock);

    context = { ...semiContextMock, eventManager };
  });

  describe('#listen', () => {
    it('runs all listeners', () => {
      const listeners = [jest.fn(), jest.fn(), jest.fn()];
      eventManager.listen(...listeners);

      expect(listeners[0]).toHaveBeenCalledWith(context);
      expect(listeners[1]).toHaveBeenCalledWith(context);
      expect(listeners[2]).toHaveBeenCalledWith(context);
    });
  });

  describe('#remove', () => {
    it('calls Socket#removeAllListeners for all listeners passed', () => {
      const listenerKeys = [EventLabels.CreateParty, EventLabels.JoinParty];
      eventManager.remove(...listenerKeys);

      expect(context.socket.removeAllListeners).toHaveBeenCalledWith(
        listenerKeys[0]
      );
      expect(context.socket.removeAllListeners).toHaveBeenCalledWith(
        listenerKeys[1]
      );
    });
  });

  describe('#send', () => {
    it('calls Socket#emit with correct data', () => {
      const event = { label: EventLabels.ChatMessage, payload: 'Hello World' };
      eventManager.send(event);
      expect(context.socket.emit).toHaveBeenCalledWith(
        event.label,
        event.payload
      );
    });
  });

  describe('#error', () => {
    it("calls Socket#emit with 'error' message", () => {
      eventManager.error(ErrorCodes.invalidData);
      expect(context.socket.emit).toHaveBeenCalledWith('error', {
        code: ErrorCodes.invalidData,
      });
    });
  });
});
