import { Server, Socket } from 'socket.io';
import { mocked } from 'ts-jest/utils';
import joinParty from '~/socket/listeners/joinParty';
import setupParty from '~/socket/middlewares/setupParty';
import { ISocketStorage } from '~/socket/storage/ISocketStorage';

jest.mock('~/socket/listeners/joinParty');

describe('setupParty', () => {
  const ioMock = <Server>{};
  const data = { partyId: '123' };

  let socketMock: Socket;
  let storageMock: ISocketStorage;
  let nextFunctionMock: jest.Mock;

  beforeEach(() => {
    socketMock = <any>{ handshake: { query: data } };
    storageMock = <any>{};
    nextFunctionMock = jest.fn();
    mocked(joinParty).mockClear();
  });

  describe('when a partyId is sended', () => {
    it("calls 'joinParty' listener", () => {
      setupParty(ioMock, socketMock, storageMock, nextFunctionMock);
      expect(joinParty).toHaveBeenCalledWith(
        ioMock,
        socketMock,
        storageMock,
        data
      );
    });
  });

  describe('when no partyId is sended', () => {
    it("does not calls 'joinParty' listener", () => {
      socketMock.handshake.query = {};
      setupParty(ioMock, socketMock, storageMock, nextFunctionMock);
      expect(joinParty).not.toHaveBeenCalled();
    });
  });

  it("calls 'next' listener", () => {
    setupParty(ioMock, socketMock, storageMock, nextFunctionMock);
    expect(nextFunctionMock).toHaveBeenCalledWith();
  });
});
