import Party from '~/socket/models/Party';
import inMemoryStorage from '~/socket/storage/inMemoryStorage';
import { act, testSocket } from '../../helpers';

describe('Parties', () => {
  describe('Create new party', () => {
    testSocket('stores party and sends its id', async ({ client, done }) => {
      client.on('party-id', partyId => {
        expect(typeof partyId).toBe('string');
        expect(inMemoryStorage.get('parties', partyId)).toBeInstanceOf(Party);
        done();
      });

      await act(() => client.emit('new-player', { username: 'Player' }));
      await act(() => client.emit('new-party'), 0);
    });
  });

  describe('Join party', () => {
    testSocket(
      'joins party and sends its id',
      async ({ client, clientFactory, done }) => {
        const incoming = clientFactory();

        client.on('player-join', data => {
          expect(data).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ username: 'Original' }),
              expect.objectContaining({ username: 'Incoming' }),
            ])
          );
          done();
        });

        await act(() => client.emit('new-player', { username: 'Original' }));
        await act(() => client.emit('new-party'), 100);

        const partyId = inMemoryStorage.getAll('parties')[0].id;
        await act(() => incoming.emit('new-player', { username: 'Incoming' }));
        await act(() => incoming.emit('join-party', { partyId }), 0);
      }
    );
  });
});
