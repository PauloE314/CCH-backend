import { Server } from 'socket.io';
import setupWebSockets from '~/socket';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';

describe('setupWebSockets', () => {
  let ioMock: Server;
  let storageMock: ISocketStorage;

  beforeEach(() => {
    ioMock = <Server>{};
    storageMock = <ISocketStorage>{};

    ioMock.on = jest.fn();
    storageMock.clearAll = jest.fn();
  });

  it("calls SocketServer#on with 'connection'", () => {
    setupWebSockets(ioMock, storageMock);
    expect(ioMock.on).toHaveBeenCalledWith('connection', expect.any(Function));
  });

  it('calls ISocketStorage#clearAll function', () => {
    setupWebSockets(ioMock, storageMock);
    expect(storageMock.clearAll).toHaveBeenCalled();
  });
});
