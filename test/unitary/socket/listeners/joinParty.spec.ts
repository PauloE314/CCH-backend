import { Server, Socket } from 'socket.io';
import { errorCodes } from '~/config/settings';
import Party from '~/socket/models/Party';
import Player from '~/socket/models/Player';
import joinParty from '~/socket/listeners/joinParty';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import playerFactory from '~/../test/factories/player';

describe('joinParty', () => {
  const ioMock = <Server>{};
  const data = { partyId: '' };

  let ownerMock: Player;
  let playerMock: Player;
  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let partyMock: Party;

  beforeEach(() => {
    playerMock = playerFactory({ partyId: '' });
    ownerMock = playerFactory({ partyId: '' });

    partyMock = new Party();
    data.partyId = partyMock.id;
    ownerMock.partyId = partyMock.id;
    partyMock.playerIds = [ownerMock.id];
    jest.spyOn(partyMock, 'sendToAll').mockImplementation();
    jest.spyOn(partyMock, 'players').mockImplementation(async () => {
      return partyMock.playerIds.length === 1
        ? [ownerMock]
        : [ownerMock, playerMock];
    });

    storageMock = <any>{
      get: jest.fn(type => (type === 'parties' ? partyMock : playerMock)),
    };

    socketMock = <any>{
      join: jest.fn(),
      emit: jest.fn(),
    };
  });

  describe('when client is not in another party', () => {
    describe('and the party exists', () => {
      it('puts client in the party', async () => {
        await joinParty(ioMock, socketMock, storageMock, data);
        expect(socketMock.join).toHaveBeenCalledWith(partyMock.id);
      });

      it('emits player-join event to party players', async () => {
        const expectedResult = {
          ownerId: partyMock.ownerId,
          allPlayers: [ownerMock, playerMock],
          player: playerMock,
        };

        await joinParty(ioMock, socketMock, storageMock, data);
        expect(partyMock.sendToAll).toHaveBeenCalledWith(
          ioMock,
          'player-join',
          expectedResult
        );
      });
    });

    describe('and the party does not exist', () => {
      it('emits inexistentParty error', async () => {
        storageMock.get = <any>(
          jest.fn(key => (key === 'players' ? playerMock : undefined))
        );

        await joinParty(ioMock, socketMock, storageMock, data);
        expect(socketMock.emit).toHaveBeenCalledWith(
          'error',
          errorCodes.inexistentParty
        );
      });
    });
  });

  describe('when client is in another party', () => {
    it('emits inParty error', async () => {
      playerMock.partyId = '12345';

      await joinParty(ioMock, socketMock, storageMock, data);
      expect(socketMock.emit).toHaveBeenCalledWith('error', errorCodes.inParty);
    });
  });
});
