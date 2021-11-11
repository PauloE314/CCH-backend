import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import newParty from '~/socket/listeners/newParty';
import Player from '~/socket/models/Player';
import { errorCodes } from '~/config/settings';
import Party from '~/socket/models/Party';

describe('newParty', () => {
  const ioMock = <Server>{};

  let playerMock: Player;
  let socketMock: Socket;
  let storageMock: ISocketStorage;

  beforeEach(() => {
    playerMock = <any>{};

    socketMock = <any>{
      id: '123456',
      emit: jest.fn(),
      join: jest.fn(),
    };

    storageMock = <any>{
      get: jest.fn(() => playerMock),
      store: jest.fn(),
    };
  });

  describe('when player is not in another room', () => {
    it('loads player', () => {
      newParty(ioMock, socketMock, storageMock, {});
      expect(storageMock.get).toHaveBeenCalledWith('players', socketMock.id);
    });

    it('stores new game party', () => {
      newParty(ioMock, socketMock, storageMock, {});
      expect(storageMock.store).toHaveBeenCalledWith(
        'parties',
        expect.any(Party)
      );
    });

    it('puts socket in room', () => {
      newParty(ioMock, socketMock, storageMock, {});
      expect(socketMock.join).toHaveBeenCalledWith(expect.any(String));
    });

    it('sends back room id', () => {
      newParty(ioMock, socketMock, storageMock, {});
      expect(socketMock.emit).toHaveBeenCalledWith(
        'party-id',
        expect.any(String)
      );
    });
  });

  describe('when player already is in another room', () => {
    it('emits and inRoom error', () => {
      playerMock.partyId = '123';
      newParty(ioMock, socketMock, storageMock, {});
      expect(socketMock.emit).toHaveBeenCalledWith('error', errorCodes.inParty);
    });
  });
});
