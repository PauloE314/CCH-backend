import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';
import {
  startWebSocketsTestClient,
  startWebSocketsTestServer,
} from './helpers';

// This is an example of how to write a test with the socket.io api.
// This kind of approach is intended to be used in integration tests, where is needed to mock the least possible.
// In unitary tests, try to test the individual pieces that makes the code

describe('WS', () => {
  let io: Server;
  let client: Socket;

  beforeAll(async () => {
    io = await startWebSocketsTestServer();
    io.on('connect', socket => socket.emit('message', 'works'));
  });

  // Always close the server instance and the client instance, if there's any
  afterAll(() => {
    io.close();
    client?.close();
  });

  describe('when a new client connects to the socket', () => {
    it('Sends a "works" message', done => {
      client = startWebSocketsTestClient();
      client.on('message', arg => {
        expect(arg).toBe('works');
        done(); // Dont't forget to use the 'done' function to end the test
      });
    });
  });
});
