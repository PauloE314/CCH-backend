import { GameStorage } from '~/socket/storage';
import { DataMap } from '~/socket/storage/DataMap';

type StorageFactoryParams = {};

const storageFactory = ({}: StorageFactoryParams = {}): Storage => {
  const storage = new Storage();
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
