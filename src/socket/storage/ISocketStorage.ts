import Party from '../models/Party';
import Player from '../models/Player';

export type TAllowedStorageKeys = 'players' | 'parties';

export interface ISocketStorage {
  store(key: TAllowedStorageKeys, data: any): Promise<void>;

  getAll(key: 'parties'): Promise<Party[]>;
  getAll(key: 'players'): Promise<Player[]>;

  get(key: 'parties', objectIdentifier: string): Promise<Party | undefined>;
  get(key: 'players', objectIdentifier: string): Promise<Player | undefined>;

  clearAll(): Promise<void>;
  remove(key: TAllowedStorageKeys, id: String): Promise<void>;
}
