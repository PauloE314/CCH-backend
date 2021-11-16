import { Server, Socket } from 'socket.io';
import { mocked } from 'ts-jest/utils';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import setupPlayer from '~/socket/middlewares/setupPlayer';
import Player from '~/socket/models/Player';
import { errorCodes } from '~/config/settings';

describe('setupPlayer', () => {
  const ioMock = <Server>{};
  const data = { username: 'Player' };

  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let nextFunctionMock: jest.Mock;

  beforeEach(() => {
    socketMock = <any>{
      emit: jest.fn(),
      removeAllListeners: jest.fn(),
      handshake: { query: data },
    };

    storageMock = <any>{ store: jest.fn() };
    nextFunctionMock = jest.fn();
  });

  describe('when is passed a username', () => {
    it('saves the new player in the player storage', async () => {
      await setupPlayer(ioMock, socketMock, storageMock, nextFunctionMock);
      expect(storageMock.store).toHaveBeenCalledWith(
        'players',
        expect.any(Player)
      );
    });

    it('saves player with correct username', async () => {
      await setupPlayer(ioMock, socketMock, storageMock, nextFunctionMock);

      const player = mocked(storageMock).store.mock.calls[0][1];
      expect(player).toMatchObject({
        username: data.username,
      });
    });

    it("calls 'next' function without error", async () => {
      await setupPlayer(ioMock, socketMock, storageMock, nextFunctionMock);
      expect(nextFunctionMock).toHaveBeenCalledWith();
    });
  });

  describe('when is not passed a username', () => {
    it("calls 'next' with an invalidData error", async () => {
      socketMock.handshake.query = {};
      await setupPlayer(ioMock, socketMock, storageMock, nextFunctionMock);
      expect(nextFunctionMock).toHaveBeenCalledWith(expect.any(Error));

      const { message } = nextFunctionMock.mock.calls[0][0];
      expect(message).toBe(`${errorCodes.invalidData}`);
    });
  });
});
