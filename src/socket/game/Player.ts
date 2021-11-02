export default class Player {
  public id: string;
  public username: string;
  public roomId: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.roomId = '';
  }
}
