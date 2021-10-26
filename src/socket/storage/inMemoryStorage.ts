type allowedKeys = 'players';

const dataSet: { [key: string]: any[] } = {
  players: [],
};

export default class InMemorySocketStorage {
  static store(key: allowedKeys, data: any) {
    if (dataSet[key]) dataSet[key].push(data);
    else dataSet[key] = [data];
  }

  static getAll(key: allowedKeys) {
    return dataSet[key];
  }

  static get(key: allowedKeys, objectId: String) {
    return dataSet[key].find(({ id }) => id === objectId);
  }
}
