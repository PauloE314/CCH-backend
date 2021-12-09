import { generateRandomString } from '~/utils';
import { Player } from './Player';
class Party {
  public id: string;
  public players: Player[];

  public get owner(): Player {
    return this.players[0];
  }

  constructor() {
    this.id = generateRandomString(6);
    this.players = [];
  }
}

export { Party };
