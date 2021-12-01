import { DataMap } from '~/socket/storage/DataMap';

describe('DataMap', () => {
  let dataMap: DataMap<any>;
  const value = {
    id: '123456',
  };

  beforeEach(() => {
    dataMap = new DataMap();
  });

  describe('#all', () => {
    describe('when the entity set is empty', () => {
      it('returns a empty array', () => {
        expect(dataMap.all()).toEqual({});
      });
    });
  });

  describe('#store', () => {
    it('stores data on the given key', () => {
      const expected = {
        [`${value.id}`]: value,
      };

      dataMap.store(value);
      expect(dataMap.all()).toEqual(expected);
    });
  });

  describe('#get', () => {
    beforeEach(() => dataMap.store(value));

    describe("when there's a corresponding entity on dataMap", () => {
      it('returns it', () => {
        expect(dataMap.get(value)).toEqual(value);
        expect(dataMap.get(value.id)).toEqual(value);
      });
    });
  });

  describe('#drop', () => {
    beforeEach(() => dataMap.store(value));

    it('removes all entities', () => {
      dataMap.drop();
      expect(dataMap.all()).toEqual({});
    });
  });

  describe('#remove', () => {
    beforeEach(() => {
      dataMap.store(value);
      dataMap.store({ id: 'abcdef' });
    });

    it('removes the given entity', () => {
      dataMap.remove(value.id);
      expect(dataMap.all()).toEqual({ abcdef: { id: 'abcdef' } });
    });
  });
});
