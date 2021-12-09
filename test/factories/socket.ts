import { Socket } from 'socket.io';
import { generateRandomString } from '~/utils';

type SocketParams = {
  id?: string;
};

const broadcastFactory = () => {
  return {
    emit: jest.fn(),
  };
};

const socketFactory = ({ id }: SocketParams = {}): Socket => {
  const socket = {
    id: id || generateRandomString(10),
    emit: jest.fn(),
    on: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
    broadcast: {
      to: jest.fn(() => broadcastFactory()),
    },
    handshake: {
      query: {},
    },
    removeAllListeners: jest.fn(),
  };

  return socket as any;
};

export { socketFactory };
