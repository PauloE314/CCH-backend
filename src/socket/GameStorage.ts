import { Party } from './models/Party';
import { Player } from './models/Player';
import { DataMap } from '~/lib/DataMap';

class GameStorage {
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

export { GameStorage };
