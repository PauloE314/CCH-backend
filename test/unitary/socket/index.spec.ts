import { Server, Socket } from 'socket.io';
import { mocked } from 'ts-jest/utils';
import setupWebSockets from '~/socket';
import { GameStorage } from '~/socket/GameStorage';
import { nameValidation } from '~/socket/middlewares/nameValidation';
import { ioFactory } from '~test/factories/io';
import { storageFactory } from '~test/factories/storage';

jest.mock('~/socket/middlewares/nameValidation');

describe('setupWebSockets', () => {
  let ioMock: Server;
  let storageMock: GameStorage;

  beforeEach(() => {
    ioMock = ioFactory();
    storageMock = storageFactory();

    mocked(nameValidation).mockClear();
  });

  it("calls SocketServer#on with 'connection'", async () => {
    await setupWebSockets(ioMock, storageMock);
    expect(ioMock.on).toHaveBeenCalledWith('connection', expect.any(Function));
  });

  it('calls SocketServer#use with proper callback', async () => {
    const socketMock = <Socket>{};
    const nextFunctionMock = jest.fn();

    await setupWebSockets(ioMock, storageMock);
    expect(ioMock.use).toHaveBeenCalledWith(expect.any(Function));

    const callback = mocked(ioMock.use).mock.calls[0][0];
    callback(socketMock, nextFunctionMock);

    expect(nameValidation).toHaveBeenCalledWith(
      expect.objectContaining({
        io: ioMock,
        socket: socketMock,
        storage: storageMock,
      }),
      nextFunctionMock
    );
  });
});
