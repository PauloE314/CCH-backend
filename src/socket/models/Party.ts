import { generateRandomString } from '~/utils';
import { Player } from './Player';
class Party {
  public id: string;
  public players: Player[];

  private readyRelation: { [id: string]: boolean };

  public get owner(): Player {
    return this.players[0];
  }

  constructor() {
    this.id = generateRandomString(6);
    this.players = [];
    this.readyRelation = {};
  }

  join(player: Player) {
    player.partyId = this.id;
    this.players.push(player);
    this.readyRelation[player.id] = false;
  }

  setReady(player: Player) {
    this.readyRelation[player.id] = true;
  }

  public allReady() {
    const notReady = Object.values(this.readyRelation).find(ready => !ready);

    if (notReady === undefined) return true;
    return false;
  }
}

export { Party };
