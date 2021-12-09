import { Server, Socket } from 'socket.io';
import { GameStorage } from '~/socket/GameStorage';
import { nameValidation } from '~/socket/middlewares/nameValidation';
import { ErrorCodes } from '~/socket/EventManager';
import { ioFactory } from '~/../test/factories/io';
import { socketFactory } from '~/../test/factories/socket';
import { storageFactory } from '~/../test/factories/storage';

describe('nameValidation', () => {
  let nextFunctionMock: jest.Mock;

  let midContext: {
    io: Server;
    socket: Socket;
    storage: GameStorage;
  };

  beforeEach(() => {
    midContext = {
      io: ioFactory(),
      socket: socketFactory(),
      storage: storageFactory(),
    };

    nextFunctionMock = jest.fn();
  });

  describe('when is passed a username', () => {
    it("calls 'next' without error", () => {
      midContext.socket.handshake.query.username = 'Player 1';
      nameValidation(midContext, nextFunctionMock);
      expect(nextFunctionMock).toHaveBeenCalledWith();
    });
  });

  describe('when is not passed a username', () => {
    it("calls 'next' with an invalidData error", async () => {
      midContext.socket.handshake.query.username = undefined;
      nameValidation(midContext, nextFunctionMock);
      expect(nextFunctionMock).toHaveBeenCalledWith(expect.any(Error));

      const { message } = nextFunctionMock.mock.calls[0][0];
      expect(message).toBe(`${ErrorCodes.invalidData}`);
    });
  });
});
