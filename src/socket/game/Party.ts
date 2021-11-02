import { generateRandomString } from '~/utils';
// import Player from './Player';

export default class Party {
  public id: string;

  constructor() {
    this.id = generateRandomString(6);
  }
}
