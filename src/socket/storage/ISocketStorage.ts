import Party from '../models/Party';
import Player from '../models/Player';

export type TAllowedStorageKeys = 'players' | 'parties';

export interface ISocketStorage {
  store(key: TAllowedStorageKeys, data: any): void;

  getAll(key: 'parties'): Party[];
  getAll(key: 'players'): Player[];

  get(key: 'parties', objectIdentifier: string): Party | undefined;
  get(key: 'players', objectIdentifier: string): Player | undefined;

  clearAll(): void;
  remove(key: TAllowedStorageKeys, id: String): void;
}
