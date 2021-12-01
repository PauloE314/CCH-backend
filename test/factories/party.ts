import { Party } from '~/socket/models/Party';

type PartyFactoryParams = {
  id?: string;
  inGame?: boolean;
};

const partyFactory = ({ id, inGame }: PartyFactoryParams = {}): Party => {
  const party = new Party();
  party.id = id || party.id;
  party.inGame = inGame || false;

  return party;
};

export { partyFactory };
