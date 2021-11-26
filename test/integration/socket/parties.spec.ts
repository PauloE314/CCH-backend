import Party from '~/socket/models/Party';
import inMemoryStorage from '~/socket/storage/inMemoryStorage';
import { act, testWSClient } from '../../helpers';

describe('Parties', () => {
  describe('Create new party', () => {
    testWSClient('stores party and sends its id', async ({ client, done }) => {
      client.on('party-id', async partyId => {
        expect(typeof partyId).toBe('string');
        expect(await inMemoryStorage.get('parties', partyId)).toBeInstanceOf(
          Party
        );
        done();
      });

      await act(() => client.emit('new-party'), 0);
    });
  });

  describe('Join party', () => {
    testWSClient(
      'joins party and sends its id',
      async ({ client, clientFactory, done }) => {
        client.on('player-join', data => {
          expect(data).toEqual({
            ownerId: expect.any(String),
            allPlayers: expect.arrayContaining([
              expect.objectContaining({ username: 'Player' }),
              expect.objectContaining({ username: 'Incoming' }),
            ]),
            player: expect.objectContaining({ username: 'Incoming' }),
          });

          done();
        });

        client.on('party-id', partyId => {
          const incoming = clientFactory({ username: 'Incoming' });
          incoming.emit('join-party', { partyId });
        });

        await act(() => client.emit('new-party'), 150);
      }
    );
  });
});
