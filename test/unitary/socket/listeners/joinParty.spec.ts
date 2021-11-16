import { Server, Socket } from 'socket.io';
import { errorCodes } from '~/config/settings';
import Party from '~/socket/models/Party';
import Player from '~/socket/models/Player';
import joinParty from '~/socket/listeners/joinParty';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';

describe('joinParty', () => {
  const ioMock = <Server>{};
  const data = { partyId: '123' };

  let playerMock: Player;
  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let partyMock: Party;

  beforeEach(() => {
    playerMock = <any>{};
    storageMock = <any>{
      get: jest.fn(type => (type === 'parties' ? partyMock : playerMock)),
    };

    socketMock = <any>{
      join: jest.fn(),
      emit: jest.fn(),
    };

    partyMock = <any>{
      id: data.partyId,
      players: jest.fn(() => []),
      sendToAll: jest.fn(),
    };
  });

  describe('when client is not in another party', () => {
    describe('and the party exists', () => {
      it('puts client in the party', async () => {
        await joinParty(ioMock, socketMock, storageMock, data);
        expect(socketMock.join).toHaveBeenCalledWith(partyMock.id);
      });

      it('emits player joined event to party players', async () => {
        await joinParty(ioMock, socketMock, storageMock, data);
        expect(partyMock.sendToAll).toHaveBeenCalledWith(
          ioMock,
          'player-join',
          expect.any(Array)
        );
      });
    });

    describe('and the party does not exist', () => {
      it('emits inexistentParty error', async () => {
        storageMock.get = <any>(
          jest.fn(key => (key === 'players' ? playerMock : undefined))
        );

        await joinParty(ioMock, socketMock, storageMock, data);
        expect(socketMock.emit).toHaveBeenCalledWith(
          'error',
          errorCodes.inexistentParty
        );
      });
    });
  });

  describe('when client is in another party', () => {
    it('emits inParty error', async () => {
      playerMock.partyId = '12345';

      await joinParty(ioMock, socketMock, storageMock, data);
      expect(socketMock.emit).toHaveBeenCalledWith('error', errorCodes.inParty);
    });
  });
});
