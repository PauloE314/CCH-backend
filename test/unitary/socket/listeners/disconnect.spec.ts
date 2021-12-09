import { mocked } from 'ts-jest/utils';
import { gameContextFactory } from '~/../test/factories/gameContext';
import { Party } from '~/socket/models/Party';
import { ErrorCodes, EventLabels } from '~/socket/EventManager';
import { GameContext } from '~/socket/GameContext';
import { joinParty } from '~/socket/listeners/joinParty';
import { partyFactory } from '~test/factories/party';
import { runListener } from '~test/helpers/unit';
import { leaveParty } from '~/socket/listeners/leaveParty';
import { chatMessage } from '~/socket/listeners/chatMessage';
import { Player } from '~/socket/models/Player';
import { playerFactory } from '~test/factories/player';
import { createParty } from '~/socket/listeners/createParty';
import { disconnect } from '~/socket/listeners/disconnect';

describe('disconnect', () => {
  let context: GameContext;
  let data: {};

  beforeEach(() => {
    data = {};
    context = gameContextFactory();
  });

  it('calls Socket#on with correct label and callback', () => {
    disconnect(context);
    expect(context.socket.on).toHaveBeenCalledWith(
      EventLabels.Disconnect,
      expect.any(Function)
    );
  });

  describe('when Disconnect is called', () => {
    describe('and the player is in a party', () => {
      let party: Party;

      beforeEach(() => {
        party = partyFactory();
        party.players = [context.player];
        context.player.partyId = party.id;

        mocked(context.storage.parties.get).mockImplementation(() => party);
      });

      describe('and there are other players in the party', () => {
        let anotherPlayer: Player;

        beforeEach(() => {
          anotherPlayer = playerFactory({ partyId: party.id });
          party.players = [context.player, anotherPlayer];
          runListener(context, leaveParty, data);
        });

        it('broadcasts LeaveParty event with proper data', () => {
          expect(context.eventManager.broadcast).toHaveBeenCalledWith({
            label: EventLabels.LeaveParty,
            to: party,
            payload: {
              player: expect.objectContaining({
                id: context.player.id,
                username: context.player.username,
              }),
              party: expect.objectContaining({
                id: party.id,
                players: [
                  expect.objectContaining({
                    id: anotherPlayer.id,
                    username: anotherPlayer.username,
                  }),
                ],
                owner: expect.objectContaining({
                  id: anotherPlayer.id,
                  username: anotherPlayer.username,
                }),
              }),
            },
          });
        });
      });

      describe('and there are not other players in the party', () => {
        beforeEach(() => {
          party.players = [context.player];
          runListener(context, leaveParty, data);
        });

        it('removes party', () => {
          expect(context.storage.parties.remove).toHaveBeenCalledWith(party);
        });
      });
    });

    it('removes player from player storage', () => {
      runListener(context, disconnect, data);
      expect(context.storage.players.remove).toHaveBeenLastCalledWith(
        context.player
      );
    });
  });
});
