import { Server, Socket } from 'socket.io';
import { mocked } from 'ts-jest/utils';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import newPlayer from '~/socket/listeners/newPlayer';
import Player from '~/socket/game/Player';

describe('newPlayer', () => {
  let ioMock: Server;
  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let data: any;

  beforeEach(() => {
    ioMock = <Server>{};
    socketMock = <Socket>{};
    storageMock = <ISocketStorage>{};
    data = { username: 'Player' };

    storageMock.store = jest.fn();
  });

  it('saves the new player in the player storage', () => {
    newPlayer(ioMock, socketMock, storageMock, data);
    expect(mocked(storageMock).store).toHaveBeenCalledWith(
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
