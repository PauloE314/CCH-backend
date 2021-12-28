import { mocked } from 'ts-jest/utils';
import { gameContextFactory } from '~/../test/factories/gameContext';
import { Party } from '~/socket/models/Party';
import { ErrorCodes, EventLabels } from '~/socket/EventManager';
import { GameContext } from '~/socket/GameContext';
import { joinParty } from '~/socket/listeners/party/joinParty';
import { partyFactory } from '~test/factories/party';
import { runListener } from '~test/helpers/unit';
import { leaveParty } from '~/socket/listeners/party/leaveParty';
import { Player } from '~/socket/models/Player';
import { playerFactory } from '~test/factories/player';
import { createParty } from '~/socket/listeners/party/createParty';

describe('leaveParty', () => {
  let context: GameContext;
  let data: {};

  beforeEach(() => {
    data = {};
    context = gameContextFactory();
  });

  it('calls Socket#on with correct label and callback', () => {
    leaveParty(context);
    expect(context.socket.on).toHaveBeenCalledWith(
      EventLabels.LeaveParty,
      expect.any(Function)
    );
  });

  describe('when LeaveParty is called', () => {
    let party: Party;

    beforeEach(() => {
      party = partyFactory();
      party.players = [context.player];
      context.player.partyId = party.id;

      mocked(context.storage.parties.get).mockImplementation(() => party);
    });

    describe('and when there are other players in room', () => {
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

    describe('and when there are not other players in room', () => {
      beforeEach(() => {
        party = partyFactory();
        context.player.partyId = party.id;
        party.players = [context.player];

        mocked(context.storage.parties.get).mockImplementation(() => party);
        runListener(context, leaveParty, data);
      });

      it('removes party', () => {
        expect(context.storage.parties.remove).toHaveBeenCalledWith(party);
      });
    });

    it('leaves party room', () => {
      runListener(context, leaveParty, data);
      expect(context.socket.leave).toHaveBeenCalledWith(party.id);
    });

    it("removes player from party's player list", () => {
      runListener(context, leaveParty, data);
      expect(party.players).not.toContain(context.player);
    });

    it('removes ChatMessage, LeaveParty and Ready events', () => {
      runListener(context, leaveParty, data);
      expect(context.eventManager.remove).toHaveBeenCalledWith(
        EventLabels.ChatMessage,
        EventLabels.LeaveParty,
        EventLabels.Ready
      );
    });

    it('adds CreateParty and JoinParty events', () => {
      runListener(context, leaveParty, data);
      expect(context.eventManager.listen).toHaveBeenCalledWith(
        joinParty,
        createParty
      );
    });
  });
});
