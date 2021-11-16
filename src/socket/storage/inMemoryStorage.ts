import Party from '../models/Party';
import Player from '../models/Player';
import { TAllowedStorageKeys, ISocketStorage } from './ISocketStorage';

const dataSet = {
  players: <Player[]>[],
  parties: <Party[]>[],
};

export default <ISocketStorage>class InMemorySocketStorage {
  static async store(key: TAllowedStorageKeys, data: any) {
    if (dataSet[key]) dataSet[key].push(data);
    else dataSet[key] = [data];
  }

  static async getAll(key: TAllowedStorageKeys) {
    return dataSet[key];
  }

  static async get(key: TAllowedStorageKeys, objectId: String) {
    return (<any[]>dataSet[key]).find(({ id }) => id === objectId);
  }

  static async remove(key: TAllowedStorageKeys, objectId: String) {
    dataSet[key] = (<any[]>dataSet[key]).filter(({ id }) => id !== objectId);
  }

  static async clearAll() {
    const keys = <TAllowedStorageKeys[]>Object.keys(dataSet);
    keys.forEach(key => {
      dataSet[key] = [];
    });
  }
};
