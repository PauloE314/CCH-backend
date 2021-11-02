import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import newRoom from '~/socket/listeners/newRoom';
import Player from '~/socket/game/Player';
import errorCodes from '~/config/errorCodes';

describe('newRoom', () => {
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

    storageMock.get = jest.fn(() => playerMock);
    socketMock.emit = jest.fn();
    socketMock.join = jest.fn();
  });

  describe('when player is not in another room', () => {
    it('loads player', () => {
      newRoom(ioMock, socketMock, storageMock);
      expect(storageMock.get).toHaveBeenCalledWith('players', socketMock.id);
    });

    it('puts socket in room', () => {
      newRoom(ioMock, socketMock, storageMock);
      expect(socketMock.join).toHaveBeenCalledWith(expect.any(String));
    });

    it('sends back room id', () => {
      newRoom(ioMock, socketMock, storageMock);
      expect(socketMock.emit).toHaveBeenCalledWith(
        'room-id',
        expect.any(String)
      );
    });
  });

  describe('when player already is in another room', () => {
    it('emits and inRoom error', () => {
      playerMock.roomId = '123';
      newRoom(ioMock, socketMock, storageMock);
      expect(socketMock.emit).toHaveBeenCalledWith('error', errorCodes.inRoom);
    });
  });
});
