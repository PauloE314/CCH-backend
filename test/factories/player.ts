import { Player } from '~/socket/models/Player';
import { generateRandomString as random } from '~/utils';

type PlayerFactoryParams = {
  id?: string;
  username?: string;
  partyId?: string;
};

const playerFactory = ({
  id,
  username,
  partyId,
}: PlayerFactoryParams = {}): Player => {
  const playerId = id === undefined ? random(6) : id;
  const playerUsername = username === undefined ? random(6) : username;
  const playerPartyId = partyId === undefined ? random(6) : partyId;

  const player = new Player(playerId, playerUsername);
  player.partyId = playerPartyId;

  return player;
};

export { playerFactory };
