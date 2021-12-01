import { Server, Socket } from 'socket.io';
import { GameStorage } from '~/socket/storage';
import { nameValidation } from '~/socket/middlewares/nameValidation';
import { ErrorCodes } from '~/socket/Events';
import { ioFactory } from '~/../test/factories/io';
import { socketFactory } from '~/../test/factories/socket';
import { storageFactory } from '~/../test/factories/storage';

describe('nameValidation', () => {
  let nextFunctionMock: jest.Mock;

  let contextMock: {
    io: Server;
    socket: Socket;
    storage: GameStorage;
  };

  beforeEach(() => {
    contextMock = {
      io: ioFactory(),
      socket: socketFactory(),
      storage: storageFactory(),
    };

    nextFunctionMock = jest.fn();
  });

  describe('when is passed a username', () => {
    it("calls 'next' without error", () => {
      contextMock.socket.handshake.query.username = 'Player 1';
      nameValidation(contextMock, nextFunctionMock);
      expect(nextFunctionMock).toHaveBeenCalledWith();
    });
  });

  describe('when is not passed a username', () => {
    it("calls 'next' with an invalidData error", async () => {
      contextMock.socket.handshake.query.username = undefined;
      nameValidation(contextMock, nextFunctionMock);
      expect(nextFunctionMock).toHaveBeenCalledWith(expect.any(Error));

      const { message } = nextFunctionMock.mock.calls[0][0];
      expect(message).toBe(`${ErrorCodes.invalidData}`);
    });
  });
});
