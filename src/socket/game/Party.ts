import { Server } from 'socket.io';
import { generateRandomString } from '~/utils';
import { ISocketStorage } from '../storage/ISocketStorage';
import Player from './Player';

export default class Party {
  public id: string;
  public inGame: boolean;

  constructor() {
    this.id = generateRandomString(6);
    this.inGame = false;
  }

  sendToAll(io: Server, eventName: string, content: any) {
    io.of(this.id).emit(eventName, content);
  }

  players(storage: ISocketStorage) {
    const allPlayers: Player[] = storage.getAll('players');
    return allPlayers.filter(({ partyId }) => partyId === this.id);
  }
}
