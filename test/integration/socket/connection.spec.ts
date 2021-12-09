import { delay } from '~/utils';
import { testWS } from '../../helpers/integration';

describe('Connection', () => {
  describe('when a username is sended', () => {
    testWS(
      'stores player and connection',
      async ({ io, clientFactory, done, storage }) => {
        clientFactory({ username: 'Player' });

        await delay(50);
        expect(Object.keys(storage.players.all()).length).toBe(1);
        expect(io.sockets.sockets.size).toBe(1);
        done();
      }
    );
  });

  describe('when no username is sended', () => {
    testWS(
      'does not saves a player neither their connection',
      async ({ io, clientFactory, done, storage }) => {
        clientFactory({ username: undefined as any });

        await delay(50);
        expect(Object.keys(storage.players.all()).length).toBe(0);
        expect(io.sockets.sockets.size).toBe(0);
        done();
      }
    );
  });
});
