import { Server } from 'socket.io';
import Party from '~/socket/game/Party';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';

describe('Party', () => {
  let ioMock: Server;
  let storageMock: ISocketStorage;
  let party: Party;

  beforeEach(() => {
    ioMock = <Server>{};
    ioMock.of = <any>jest.fn(() => ioMock);
    ioMock.emit = jest.fn();

    storageMock = <ISocketStorage>{};
    storageMock.getAll = jest.fn(() => []);

    party = new Party();
  });

  it('auto generates random id', () => {
    expect(party.id).toEqual(expect.any(String));
    expect(party.id.length).toBe(6);
  });

  describe('#sendToAll', () => {
    it('calls Server#of and Server#emit methods', () => {
      party.sendToAll(ioMock, 'event', 'any content');
      expect(ioMock.of).toHaveBeenCalledWith(party.id);
      expect(ioMock.emit).toHaveBeenCalledWith('event', 'any content');
    });
  });

  describe('#players', () => {
    it('calls SocketStorage#getAll', () => {
      party.players(storageMock);
      expect(storageMock.getAll).toHaveBeenCalledWith('players');
    });

    it('returns correct players', () => {
      storageMock.getAll = <any>(
        jest.fn(() => [
          { partyId: party.id },
          { partyId: party.id },
          { partyId: '123' },
          { partyId: '123' },
        ])
      );

      const result = party.players(storageMock);
      expect(result).toEqual([{ partyId: party.id }, { partyId: party.id }]);
    });
  });
});
