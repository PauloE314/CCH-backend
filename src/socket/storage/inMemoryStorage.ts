import Player from '../game/Player';
import { allowedStorageKeys, ISocketStorage } from './ISocketStorage';

const dataSet = {
  players: <Player[]>[],
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

  static remove(key: allowedStorageKeys, objectId: String) {
    return dataSet[key].filter(({ id }) => id === objectId);
  }

  static clearAll() {
    const keys = <allowedStorageKeys[]>Object.keys(dataSet);
    keys.forEach(key => {
      dataSet[key] = [];
    });
  }
};
