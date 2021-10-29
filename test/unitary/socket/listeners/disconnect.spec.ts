import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import disconnect from '~/socket/listeners/disconnect';

describe('disconnect', () => {
  let ioMock: Server;
  let socketMock: Socket;
  let storageMock: ISocketStorage;

  beforeEach(() => {
    ioMock = <Server>{};
    socketMock = <Socket>{ id: '123456789' };
    storageMock = <ISocketStorage>{};

    storageMock.remove = jest.fn();
  });

  it('removes disconnecting player from storage', () => {
    disconnect(ioMock, socketMock, storageMock);
    expect(storageMock.remove).toHaveBeenCalledWith('players', socketMock.id);
  });
});
