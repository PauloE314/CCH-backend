import { Party } from '../models/Party';
import { Player } from '../models/Player';
import { DataMap } from './DataMap';

interface SocketStorage {
  players: DataMap<Player>;
  parties: DataMap<Party>;

  drop(): void;
}

class Storage implements SocketStorage {
  public players: DataMap<Player>;
  public parties: DataMap<Party>;

  constructor() {
    this.players = new DataMap<Player>();
    this.parties = new DataMap<Party>();
  }

  public drop() {
    this.players.drop();
    this.parties.drop();
  }
}

export { Storage, SocketStorage };
