import { Server, Socket } from 'socket.io';
import { mocked } from 'ts-jest/utils';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import newPlayer from '~/socket/listeners/newPlayer';
import Player from '~/socket/game/Player';
import errorCodes from '~/config/errorCodes';

describe('newPlayer', () => {
  const ioMock = <Server>{};
  const data = { username: 'Player' };

  let socketMock: Socket;
  let storageMock: ISocketStorage;

  beforeEach(() => {
    socketMock = <any>{ emit: jest.fn() };
    storageMock = <any>{ store: jest.fn() };
  });

  describe('when is passed a username', () => {
    it('saves the new player in the player storage', () => {
      newPlayer(ioMock, socketMock, storageMock, data);
      expect(storageMock.store).toHaveBeenCalledWith(
        'players',
        expect.any(Player)
      );
    });

    it('saves player with correct username', () => {
      newPlayer(ioMock, socketMock, storageMock, data);

      const player = mocked(storageMock).store.mock.calls[0][1];
      expect(player).toMatchObject({
        username: data.username,
      });
    });
  });

  describe('when is not passed a username', () => {
    it('emits an invalidData error', () => {
      newPlayer(ioMock, socketMock, storageMock, {});
      expect(socketMock.emit).toHaveBeenCalledWith(
        'error',
        errorCodes.invalidData
      );
    });
  });
});
