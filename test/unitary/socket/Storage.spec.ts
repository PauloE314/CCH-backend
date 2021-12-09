import { GameStorage } from '~/socket/GameStorage';
import { DataMap } from '~/lib/DataMap';

const fields = ['players', 'parties'];

describe('Storage', () => {
  let storage: GameStorage;

  beforeEach(() => {
    storage = new GameStorage();
  });

  it('contains the necessary DataMaps', () => {
    fields.forEach(field => {
      expect((storage as any)[field]).toBeInstanceOf(DataMap);
    });
  });

  describe('#drop', () => {
    it('calls all DataMap#drop', () => {
      fields.forEach(field => {
        jest.spyOn((storage as any)[field], 'drop');
      });

      storage.drop();

      fields.forEach(field => {
        expect((storage as any)[field].drop).toHaveBeenCalled();
      });
    });
  });
});
