class Player {
  public id: string;
  public username: string;
  public partyId: string;

  constructor(id: string, username: string) {
    this.id = id;
    this.username = username;
    this.partyId = '';
  }
}

export { Player };
