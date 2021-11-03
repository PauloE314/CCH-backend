import { Server, Socket } from 'socket.io';
import errorCodes from '~/config/errorCodes';
import Party from '~/socket/game/Party';
import Player from '~/socket/game/Player';
import joinParty from '~/socket/listeners/joinParty';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';

describe('joinParty', () => {
  let ioMock: Server;
  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let partyMock: Party;
  let playerMock: Player;
  let data: { partyId: string };

  beforeEach(() => {
    ioMock = <any>{};
    playerMock = <any>{};

    storageMock = <any>{
      get: jest.fn(type => (type === 'parties' ? partyMock : playerMock)),
    };

    socketMock = <any>{
      join: jest.fn(),
      emit: jest.fn(),
    };

    partyMock = <any>{
      id: '123',
      players: jest.fn(() => []),
      sendToAll: jest.fn(),
    };

    data = { partyId: partyMock.id };
  });

  describe('when client is not in another party', () => {
    describe('and the party exists', () => {
      it('puts client in the party', () => {
        joinParty(ioMock, socketMock, storageMock, data);
        expect(socketMock.join).toHaveBeenCalledWith(partyMock.id);
      });

      it('emits player joined event to party players', () => {
        joinParty(ioMock, socketMock, storageMock, data);
        expect(partyMock.sendToAll).toHaveBeenCalledWith(
          ioMock,
          'player-join',
          expect.any(Array)
        );
      });
    });

    describe('and the party does not exist', () => {
      it('emits inexistentParty error', () => {
        storageMock.get = <any>(
          jest.fn(key => (key === 'players' ? playerMock : undefined))
        );

        joinParty(ioMock, socketMock, storageMock, data);
        expect(socketMock.emit).toHaveBeenCalledWith(
          'error',
          errorCodes.inexistentParty
        );
      });
    });
  });

  describe('when client is in another party', () => {
    it('emits inParty error', () => {
      playerMock.partyId = '12345';

      joinParty(ioMock, socketMock, storageMock, data);
      expect(socketMock.emit).toHaveBeenCalledWith('error', errorCodes.inParty);
    });
  });
});