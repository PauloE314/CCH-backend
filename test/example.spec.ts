import { testSocket } from './helpers';

// This is an example of how to write a test with the socket.io api.
// This kind of approach is intended to be used in integration tests, where is needed to mock the least possible.
// In unitary tests, try to test the individual pieces that makes the code

describe('WS', () => {
  describe('when a new client connects to the socket', () => {
    testSocket('Sends "message" message', (io, client, done) => {
      io.on('connect', socket => socket.emit('message', 'works'));
      client.on('message', arg => {
        expect(arg).toBe('works');
        done(); // Dont't forget to use the 'done' function to end the test
      });
    });
  });
});
