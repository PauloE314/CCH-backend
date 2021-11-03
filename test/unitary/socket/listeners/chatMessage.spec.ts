import { Server, Socket } from 'socket.io';
import errorCodes from '~/config/errorCodes';
import Party from '~/socket/game/Party';
import Player from '~/socket/game/Player';
import chatMessage from '~/socket/listeners/chatMessage';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';

describe('chatMessage', () => {
  let ioMock: Server;
  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let playerMock: Player;
  let partyMock: Party;
  let data: { message: string };

  beforeEach(() => {
    ioMock = <any>{};
    socketMock = <any>{ emit: jest.fn() };
    partyMock = <any>{ id: '123', sendToAllExcept: jest.fn() };
    playerMock = <any>{ partyId: partyMock.id };
    storageMock = <any>{
      get: jest.fn(key => (key === 'players' ? playerMock : partyMock)),
    };

    data = { message: 'Hello World!' };
  });

  describe('when player is in party', () => {
    it('sends chat message event for all except the player', () => {
      chatMessage(ioMock, socketMock, storageMock, data);
      expect(partyMock.sendToAllExcept).toHaveBeenCalledWith(
        socketMock,
        'chat-message',
        data.message
      );
    });
  });

  describe('when player is not in party', () => {
    it('emits not in party error', () => {
      playerMock.partyId = '';
      partyMock = <any>null;

      chatMessage(ioMock, socketMock, storageMock, data);
      expect(socketMock.emit).toHaveBeenCalledWith(
        'error',
        errorCodes.notInParty
      );
    });
  });
});
