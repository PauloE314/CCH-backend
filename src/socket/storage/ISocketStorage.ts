export type allowedStorageKeys = 'players' | 'parties';

export interface ISocketStorage {
  store(key: allowedStorageKeys, data: any): void;
  getAll(key: allowedStorageKeys): any[];
  get(key: allowedStorageKeys, objectIdentifier: String): any;
  clearAll(): void;
  remove(key: allowedStorageKeys, id: String): void;
}
