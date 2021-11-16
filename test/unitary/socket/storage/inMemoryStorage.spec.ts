import InMemorySocketStorage from '~/socket/storage/inMemoryStorage';

describe('InMemorySocketStorage', () => {
  const dataSet = {
    players: [
      { id: '123456789', username: 'User1' },
      { id: 'ABCDEFGHI', username: 'User2' },
    ],
  };
  const { players } = dataSet;

  describe('#getAll', () => {
    describe('when the entity set is empty', () => {
      it('returns a empty array', async () => {
        expect(await InMemorySocketStorage.getAll('players')).toEqual([]);
      });
    });
  });

  describe('#store', () => {
    it('stores data on the given key', async () => {
      const player = players[0];
      await InMemorySocketStorage.store('players', player);
      expect(await InMemorySocketStorage.getAll('players')).toEqual([player]);
    });
  });

  describe('#get', () => {
    const player = players[0];

    beforeAll(() => {
      InMemorySocketStorage.store('players', player);
    });

    describe("when there's a corresponding entity on dataset", () => {
      it('returns it', async () => {
        expect(await InMemorySocketStorage.get('players', player.id)).toEqual(
          player
        );
      });
    });
  });

  describe('#clearAll', () => {
    beforeAll(() => {
      players.forEach(player => InMemorySocketStorage.store('players', player));
    });

    it('removes all entities', async () => {
      await InMemorySocketStorage.clearAll();
      expect(await InMemorySocketStorage.getAll('players')).toEqual([]);
    });
  });

  describe('#remove', () => {
    beforeAll(async () => {
      await InMemorySocketStorage.store('players', players[0]);
    });

    it('removes all entities', async () => {
      await InMemorySocketStorage.remove('players', players[0].id);
      expect(await InMemorySocketStorage.getAll('players')).toEqual([]);
    });
  });
});
