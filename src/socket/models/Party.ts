import { generateRandomString } from '~/utils';

class Party {
  public id: string;
  public inGame: boolean;
  public playerIds: string[];

  public get ownerId(): string {
    return this.playerIds[0];
  }

  constructor() {
    this.id = generateRandomString(6);
    this.inGame = false;
    this.playerIds = [];
  }
}

export { Party };
