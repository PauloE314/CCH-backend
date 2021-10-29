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
      it('returns a empty array', () => {
        expect(InMemorySocketStorage.getAll('players')).toEqual([]);
      });
    });
  });

  describe('#store', () => {
    it('stores data on the given key', () => {
      const player = players[0];
      InMemorySocketStorage.store('players', player);
      expect(InMemorySocketStorage.getAll('players')).toEqual([player]);
    });
  });

  describe('#get', () => {
    const player = players[0];

    beforeAll(() => {
      InMemorySocketStorage.store('players', player);
    });

    describe("when there's a corresponding entity on dataset", () => {
      it('returns it', () => {
        expect(InMemorySocketStorage.get('players', player.id)).toEqual(player);
      });
    });
  });

  describe('#clearAll', () => {
    beforeAll(() => {
      players.forEach(player => InMemorySocketStorage.store('players', player));
    });

    it('removes all entities', () => {
      InMemorySocketStorage.clearAll();
      expect(InMemorySocketStorage.getAll('players')).toEqual([]);
    });
  });

  describe('#remove', () => {
    beforeAll(() => {
      InMemorySocketStorage.store('players', players[0]);
    });

    it('removes all entities', () => {
      InMemorySocketStorage.remove('players', players[0].id);
      expect(InMemorySocketStorage.getAll('players')).toEqual([]);
    });
  });
});
