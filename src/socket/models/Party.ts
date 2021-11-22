import { Server, Socket } from 'socket.io';
import { generateRandomString } from '~/utils';
import { ISocketStorage } from '../storage/ISocketStorage';

export default class Party {
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

  sendToAll(io: Server, eventName: string, content?: any) {
    io.to(this.id).emit(eventName, content);
  }

  sendToAllExcept(socket: Socket, eventName: string, content?: any) {
    socket.broadcast.to(this.id).emit(eventName, content);
  }

  async players(storage: ISocketStorage) {
    const all = await Promise.all(
      this.playerIds.map(id => storage.get('players', id))
    );

    return all.filter(player => player !== undefined);
  }
}
