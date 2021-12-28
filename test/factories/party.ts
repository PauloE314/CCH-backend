import { Party } from '~/socket/models/Party';
import { Player } from '~/socket/models/Player';

type PartyFactoryParams = {
  id?: string;
  players?: Player[];
};

const partyFactory = ({ id, players }: PartyFactoryParams = {}): Party => {
  const party = new Party();
  party.id = id || party.id;
  party.players = players || [];

  party.toggleReady = jest.fn();
  party.allReady = jest.fn();

  return party;
};

export { partyFactory };
