import { Server, Socket } from 'socket.io';
import { mocked } from 'ts-jest/utils';
import Party from '~/socket/models/Party';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import playerFactory from '~/../test/factories/player';

describe('Party', () => {
  let storageMock: ISocketStorage;
  let party: Party;

  beforeEach(() => {
    storageMock = <any>{ get: jest.fn(() => []) };
    party = new Party();
  });

  it('auto generates random id', () => {
    expect(party.id).toEqual(expect.any(String));
    expect(party.id.length).toBe(6);
  });

  describe('#sendToAll', () => {
    it('calls Server#to and Server#emit methods', () => {
      const ioMock: Server = <any>{
        to: jest.fn(() => ioMock),
        emit: jest.fn(),
      };

      party.sendToAll(ioMock, 'event', 'any content');
      expect(ioMock.to).toHaveBeenCalledWith(party.id);
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
    describe('when there are players in the party', () => {
      it('returns correct players', async () => {
        mocked(storageMock.get).mockImplementation(async (_, id) =>
          playerFactory({ id, partyId: party.id })
        );

        party.playerIds = ['123', '456'];
        const result = await party.players(storageMock);
        expect(result).toEqual([
          expect.objectContaining({
            id: '123',
            partyId: party.id,
          }),
          expect.objectContaining({
            id: '456',
            partyId: party.id,
          }),
        ]);
      });
    });

    describe('when there are no players in party', () => {
      it('returns an empty list', async () => {
        party.playerIds = [];
        const response = await party.players(storageMock);
        expect(response).toEqual([]);
      });
    });
  });
});
