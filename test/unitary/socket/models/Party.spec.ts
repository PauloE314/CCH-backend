import { Party } from '~/socket/models/Party';
import { Player } from '~/socket/models/Player';
import { playerFactory } from '~test/factories/player';

describe('Party', () => {
  let party: Party;
  let players: Player[];

  beforeEach(() => {
    party = new Party();
    players = [playerFactory(), playerFactory(), playerFactory()];

    party.join(players[0]);
    party.join(players[1]);
    party.join(players[2]);
  });

  describe('when player are not ready', () => {
    it('allReady returns false', () => {
      expect(party.allReady()).toBeFalsy();
      party.setReady(players[0]);
      expect(party.allReady()).toBeFalsy();
    });
  });

  describe('when player are ready', () => {
    it('allReady returns true', () => {
      party.setReady(players[0]);
      party.setReady(players[1]);
      party.setReady(players[2]);
      expect(party.allReady()).toBeTruthy();
    });
  });
});
