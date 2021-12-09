import { Party } from '~/socket/models/Party';
import { Player } from '~/socket/models/Player';
import { GameContext } from '../GameContext';

type Listener = (context: GameContext) => void;

function serializeParty(party: Party) {
  return {
    id: party.id,
    players: party.players.map(player => ({
      id: player.id,
      username: player.username,
    })),
    owner: {
      id: party.owner.id,
      username: party.owner.username,
    },
  };
}

function serializePlayer(player: Player) {
  return {
    id: player.id,
    username: player.username,
  };
}

export { Listener, serializeParty, serializePlayer };
