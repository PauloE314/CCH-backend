import { Server, Socket } from 'socket.io';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import disconnect from '~/socket/listeners/disconnect';
import Party from '~/socket/models/Party';
import Player from '~/socket/models/Player';
import playerFactory from '~/../test/factories/player';

describe('disconnect', () => {
  const ioMock = <Server>{};

  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let partyMock: Party;
  let playerMock: Player;
  let player2Mock: Player;

  beforeEach(() => {
    socketMock = <any>{
      id: '123456789',
      emit: jest.fn(),
    };

    playerMock = playerFactory({ id: socketMock.id });
    player2Mock = playerFactory({
      id: '567789',
      username: 'player 2',
      partyId: playerMock.partyId,
    });

    partyMock = new Party();
    partyMock.id = playerMock.partyId;
    partyMock.playerIds = [playerMock.id, player2Mock.id];
    jest.spyOn(partyMock, 'sendToAll').mockImplementation();

    storageMock = <any>{
      remove: jest.fn(),
      get: jest.fn((key, id) => {
        if (key === 'parties') return partyMock;
        return id === playerMock.id ? playerMock : player2Mock;
      }),
    };
  });

  it('removes disconnecting player from storage', async () => {
    await disconnect(ioMock, socketMock, storageMock, {});
    expect(storageMock.remove).toHaveBeenCalledWith('players', socketMock.id);
  });

  describe('when player is in party', () => {
    describe('and there are other players in party', () => {
      describe("and it's the party owner", () => {
        it('sets next player to be the party owner', async () => {
          partyMock.playerIds = [playerMock.id, player2Mock.id];
          jest
            .spyOn(partyMock, 'players')
            .mockImplementation(async () => [playerMock, player2Mock]);

          await disconnect(ioMock, socketMock, storageMock, {});

          expect(partyMock.ownerId).toBe(player2Mock.id);
        });
      });

      it('emits player-leave event to remaining players', async () => {
        await disconnect(ioMock, socketMock, storageMock, {});
        const expectedResponse = {
          ownerId: partyMock.ownerId,
          allPlayers: [player2Mock],
          player: playerMock,
        };

        expect(partyMock.sendToAll).toHaveBeenCalledWith(
          ioMock,
          'player-leave',
          expectedResponse
        );
      });
    });

    describe('and there are not other players in party', () => {
      it('deletes party', async () => {
        partyMock.playerIds = [playerMock.id];
        jest
          .spyOn(partyMock, 'players')
          .mockImplementation(async () => [playerMock]);

        await disconnect(ioMock, socketMock, storageMock, {});

        expect(storageMock.remove).toHaveBeenCalledWith(
          'parties',
          partyMock.id
        );
      });
    });
  });
});
