import InMemorySocketStorage from '~/socket/storage/inMemoryStorage';

describe('InMemorySocketStorage', () => {
  const player = { id: '123456789' };

  describe('#getAll', () => {
    describe('when a entity dataSet its empty', () => {
      it('returns a empty array', () => {
        expect(InMemorySocketStorage.getAll('players')).toEqual([]);
      });
    });
  });

  describe('#store', () => {
    it('stores data on the given key', () => {
      InMemorySocketStorage.store('players', player);
      expect(InMemorySocketStorage.getAll('players')).toEqual([player]);
    });
  });

  describe('#get', () => {
    beforeAll(() => {
      InMemorySocketStorage.store('players', player);
    });

    describe("when there's a corresponding entity on dataset", () => {
      it('returns it', () => {
        expect(InMemorySocketStorage.get('players', '123456789')).toEqual(
          player
        );
      });
    });
  });
});
