import { Server, Socket } from 'socket.io';
import Party from '~/socket/game/Party';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';

describe('Party', () => {
  let storageMock: ISocketStorage;
  let party: Party;

  beforeEach(() => {
    storageMock = <any>{ getAll: jest.fn(() => []) };
    party = new Party();
  });

  it('auto generates random id', () => {
    expect(party.id).toEqual(expect.any(String));
    expect(party.id.length).toBe(6);
  });

  describe('#sendToAll', () => {
    it('calls Server#of and Server#emit methods', () => {
      const ioMock: Server = <any>{
        of: jest.fn(() => ioMock),
        emit: jest.fn(),
      };

      party.sendToAll(ioMock, 'event', 'any content');
      expect(ioMock.of).toHaveBeenCalledWith(party.id);
      expect(ioMock.emit).toHaveBeenCalledWith('event', 'any content');
    });
  });

  describe('#sendToAllExcept', () => {
    it('calls Socket.broadcast#of and Socket#emit methods', () => {
      const socketMock: Socket = <any>{
        broadcast: { to: jest.fn(() => socketMock) },
        emit: jest.fn(),
      };

      party.sendToAllExcept(socketMock, 'event', 'any content');
      expect(socketMock.broadcast.to).toHaveBeenCalledWith(party.id);
      expect(socketMock.emit).toHaveBeenCalledWith('event', 'any content');
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
