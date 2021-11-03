import Party from '../game/Party';
import Player from '../game/Player';

export type allowedStorageKeys = 'players' | 'parties';

export interface ISocketStorage {
  store(key: allowedStorageKeys, data: any): void;

  getAll(key: 'parties'): Party[];
  getAll(key: 'players'): Player[];

  get(key: 'parties', objectIdentifier: string): Party | undefined;
  get(key: 'players', objectIdentifier: string): Player;

  clearAll(): void;
  remove(key: allowedStorageKeys, id: String): void;
}
