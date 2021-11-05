import inMemoryStorage from '~/socket/storage/inMemoryStorage';
import { act, testWSClient } from '../../helpers';

describe('Players', () => {
  testWSClient('stores new player', async ({ client, done }) => {
    await act(() => client.emit('new-player', { username: 'Player' }));
    expect(inMemoryStorage.getAll('players').length).toBe(1);
    done();
  });

  describe('when new player event is fired twice', () => {
    testWSClient('prevents creating new player', async ({ client, done }) => {
      await act(() => client.emit('new-player', { username: 'Original' }));
      await act(() => client.emit('new-player', { username: 'New' }));

      const players = inMemoryStorage.getAll('players');
      expect(players.length).toBe(1);
      expect(players[0]).toEqual(
        expect.objectContaining({ username: 'Original' })
      );
      done();
    });
  });
});
