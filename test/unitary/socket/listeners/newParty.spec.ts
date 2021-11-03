import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import newParty from '~/socket/listeners/newParty';
import Player from '~/socket/game/Player';
import errorCodes from '~/config/errorCodes';
import Party from '~/socket/game/Party';

describe('newParty', () => {
  let ioMock: Server;
  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let playerMock: Player;

  beforeEach(() => {
    ioMock = <Server>{};
    socketMock = <Socket>{
      id: '123456',
    };
    storageMock = <ISocketStorage>{};
    playerMock = <Player>{};

    storageMock.get = <any>jest.fn(() => playerMock);
    storageMock.store = jest.fn();
    socketMock.emit = jest.fn();
    socketMock.join = jest.fn();
  });

  describe('when player is not in another room', () => {
    it('loads player', () => {
      newParty(ioMock, socketMock, storageMock);
      expect(storageMock.get).toHaveBeenCalledWith('players', socketMock.id);
    });

    it('stores new game party', () => {
      newParty(ioMock, socketMock, storageMock);
      expect(storageMock.store).toHaveBeenCalledWith(
        'parties',
        expect.any(Party)
      );
    });

    it('puts socket in room', () => {
      newParty(ioMock, socketMock, storageMock);
      expect(socketMock.join).toHaveBeenCalledWith(expect.any(String));
    });

    it('sends back room id', () => {
      newParty(ioMock, socketMock, storageMock);
      expect(socketMock.emit).toHaveBeenCalledWith(
        'party-id',
        expect.any(String)
      );
    });
  });

  describe('when player already is in another room', () => {
    it('emits and inRoom error', () => {
      playerMock.partyId = '123';
      newParty(ioMock, socketMock, storageMock);
      expect(socketMock.emit).toHaveBeenCalledWith('error', errorCodes.inParty);
    });
  });
});
