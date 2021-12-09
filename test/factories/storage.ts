import { GameStorage } from '~/socket/GameStorage';
import { DataMap } from '~/lib/DataMap';

type StorageFactoryParams = {};

const storageFactory = ({}: StorageFactoryParams = {}): GameStorage => {
  const storage = new GameStorage();
  jest.spyOn(storage, 'drop');

  Object.values(storage).forEach(value => {
    if (value instanceof DataMap) {
      jest.spyOn(value, 'get');
      jest.spyOn(value, 'all');
      jest.spyOn(value, 'drop');
      jest.spyOn(value, 'remove');
      jest.spyOn(value, 'store');
    }
  });

  return storage;
};

export { storageFactory };
