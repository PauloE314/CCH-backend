import { Server } from 'socket.io';

const ioFactory = (): Server => {
  return {
    on: jest.fn(),
    use: jest.fn(),
  } as any;
};

export { ioFactory };
