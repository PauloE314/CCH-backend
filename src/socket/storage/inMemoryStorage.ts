import { allowedStorageKeys, ISocketStorage } from './ISocketStorage';

const dataSet: { [key in allowedStorageKeys]: any[] } = {
  players: [],
};

export default <ISocketStorage>class InMemorySocketStorage {
  static store(key: allowedStorageKeys, data: any) {
    if (dataSet[key]) dataSet[key].push(data);
    else dataSet[key] = [data];
  }

  static getAll(key: allowedStorageKeys) {
    return dataSet[key];
  }

  static get(key: allowedStorageKeys, objectId: String) {
    return dataSet[key].find(({ id }) => id === objectId);
  }

  static clearAll() {
    Object.keys(dataSet).forEach(key => {
      dataSet[<allowedStorageKeys>key] = [];
    });
  }
};
