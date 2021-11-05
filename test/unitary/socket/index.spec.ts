import { Server, Socket } from 'socket.io';
import { mocked } from 'ts-jest/utils';
import setupWebSockets from '~/socket';
import setupPlayer from '~/socket/middlewares/setupPlayer';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';

jest.mock('~/socket/middlewares/setupPlayer');

describe('setupWebSockets', () => {
  let ioMock: Server;
  let storageMock: ISocketStorage;

  beforeEach(() => {
    ioMock = <any>{
      on: jest.fn(),
      use: jest.fn(),
    };

    storageMock = <any>{
      clearAll: jest.fn(),
    };
  });

  it("calls SocketServer#on with 'connection'", () => {
    setupWebSockets(ioMock, storageMock);
    expect(ioMock.on).toHaveBeenCalledWith('connection', expect.any(Function));
  });

  it('calls SocketServer#use with proper callback', () => {
    const socketMock = <Socket>{};
    const nextFunctionMock = jest.fn();

    setupWebSockets(ioMock, storageMock);
    expect(ioMock.use).toHaveBeenCalledWith(expect.any(Function));

    const callback = mocked(ioMock.use).mock.calls[0][0];
    callback(socketMock, nextFunctionMock);

    expect(setupPlayer).toHaveBeenCalledWith(
      socketMock,
      expect.anything(),
      nextFunctionMock
    );
  });

  it('calls ISocketStorage#clearAll function', () => {
    setupWebSockets(ioMock, storageMock);
    expect(storageMock.clearAll).toHaveBeenCalled();
  });
});
