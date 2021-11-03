import inMemoryStorage from '~/socket/storage/inMemoryStorage';
import { act, testSocket } from '../../helpers';

describe('Players', () => {
  testSocket('stores new player', async ({ client, done }) => {
    await act(() => client.emit('new-player', { username: 'Player' }));
    expect(inMemoryStorage.getAll('players').length).toBe(1);
    done();
  });
});
