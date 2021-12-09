import { testWS } from './helpers/integration';

// This is an example of how to write a test with the socket.io api.
// This kind of approach is intended to be used in integration tests, where is needed to mock the least possible.
// In unitary tests, try to test the individual pieces that makes the code

describe('WS', () => {
  describe('when a new client connects to the socket', () => {
    testWS(
      "Sends 'foo' message with content 'bar'",
      ({ io, clientFactory, done }) => {
        io.on('connect', socket => socket.emit('message', 'works'));

        const client = clientFactory({ username: 'Client' });
        client.on('message', arg => {
          expect(arg).toBe('works');
          done(); // Dont't forget to use the 'done' function to end the test
        });
      }
    );
  });
});
