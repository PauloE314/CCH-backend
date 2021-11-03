import Party from '../game/Party';
import Player from '../game/Player';
import { TAllowedStorageKeys, ISocketStorage } from './ISocketStorage';

const dataSet = {
  players: <Player[]>[],
  parties: <Party[]>[],
};

export default <ISocketStorage>class InMemorySocketStorage {
  static store(key: TAllowedStorageKeys, data: any) {
    if (dataSet[key]) dataSet[key].push(data);
    else dataSet[key] = [data];
  }

  static getAll(key: TAllowedStorageKeys) {
    return dataSet[key];
  }

  static get(key: TAllowedStorageKeys, objectId: String) {
    return (<any[]>dataSet[key]).find(({ id }) => id === objectId);
  }

  static remove(key: TAllowedStorageKeys, objectId: String) {
    dataSet[key] = (<any[]>dataSet[key]).filter(({ id }) => id !== objectId);
  }

  static clearAll() {
    const keys = <TAllowedStorageKeys[]>Object.keys(dataSet);
    keys.forEach(key => {
      dataSet[key] = [];
    });
  }
};
