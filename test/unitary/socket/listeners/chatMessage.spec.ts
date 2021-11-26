import { Server, Socket } from 'socket.io';
import { errorCodes } from '~/config/settings';
import Party from '~/socket/models/Party';
import Player from '~/socket/models/Player';
import chatMessage from '~/socket/listeners/chatMessage';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';
import playerFactory from '~/../test/factories/player';

describe('chatMessage', () => {
  const ioMock = <Server>{};
  const data = { message: 'Hello World!' };

  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let playerMock: Player;
  let partyMock: Party;

  beforeEach(() => {
    socketMock = <any>{ emit: jest.fn() };
    partyMock = <any>{ id: '123', sendToAllExcept: jest.fn() };
    playerMock = playerFactory({ partyId: partyMock.id });
    storageMock = <any>{
      get: jest.fn(key => (key === 'players' ? playerMock : partyMock)),
    };
  });

  describe('when player is in party', () => {
    it('sends chat message event for all except the player', async () => {
      await chatMessage(ioMock, socketMock, storageMock, data);
      expect(partyMock.sendToAllExcept).toHaveBeenCalledWith(
        socketMock,
        'chat-message',
        data.message
      );
    });
  });

  describe('when player is not in party', () => {
    it('emits not in party error', async () => {
      playerMock.partyId = '';
      partyMock = <any>null;

      await chatMessage(ioMock, socketMock, storageMock, data);
      expect(socketMock.emit).toHaveBeenCalledWith(
        'error',
        errorCodes.notInParty
      );
    });
  });
});
