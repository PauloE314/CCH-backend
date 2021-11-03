import { Server, Socket } from 'socket.io';
import { mocked } from 'ts-jest/utils';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import disconnect from '~/socket/listeners/disconnect';
import Player from '~/socket/game/Player';
import Party from '~/socket/game/Party';

describe('disconnect', () => {
  let ioMock: Server;
  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let playerMock: Player;
  let partyMock: Party;

  beforeEach(() => {
    ioMock = <Server>{};
    socketMock = <any>{ id: '123456789', emit: jest.fn() };
    storageMock = <any>{
      remove: jest.fn(),
      get: jest.fn(key => (key === 'players' ? playerMock : partyMock)),
    };

    partyMock = <any>{
      id: '123',
      players: jest.fn(() => [playerMock, { id: 'def' }]),
      sendToAll: jest.fn(),
    };

    playerMock = <any>{ id: 'abc', partyId: partyMock.id };
  });

  it('removes disconnecting player from storage', () => {
    disconnect(ioMock, socketMock, storageMock, {});
    expect(storageMock.remove).toHaveBeenCalledWith('players', socketMock.id);
  });

  describe('when player is in party', () => {
    describe('and there are other players in party', () => {
      it('emits player leave event to remaining players', () => {
        disconnect(ioMock, socketMock, storageMock, {});
        expect(partyMock.sendToAll).toHaveBeenCalledWith(
          ioMock,
          'player-leave',
          playerMock
        );
      });
    });

    describe('and there are not other players in party', () => {
      it('deletes party', () => {
        mocked(partyMock.players).mockImplementation(() => [playerMock]);
        disconnect(ioMock, socketMock, storageMock, {});
        expect(storageMock.remove).toHaveBeenCalledWith(
          'parties',
          partyMock.id
        );
      });
    });
  });
});
