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

describe('joinParty', () => {
  let context: GameContext;
  let data: { partyId: string };

  beforeEach(() => {
    context = gameContextFactory();
    data = { partyId: '123' };
  });

  it('calls Socket#on with correct label and callback', () => {
    joinParty(context);
    expect(context.socket.on).toHaveBeenCalledWith(
      EventLabels.JoinParty,
      expect.any(Function)
    );
  });

  describe('when JoinParty is called', () => {
    describe('and the party exists', () => {
      let party: Party;

      beforeEach(() => {
        party = partyFactory({ id: data.partyId });
        mocked(context.storage.parties.get).mockImplementation(() => party);

        runListener(context, joinParty, data);
      });

      it('sets Player#partyId to the correct value', () => {
        expect(context.player.partyId).toBe(party.id);
      });

      it('stores Player in Party#players property', () => {
        expect(party.players).toEqual([context.player]);
      });

      it('joins socket to party room', () => {
        expect(context.socket.join).toHaveBeenCalledWith(party.id);
      });

      it('sends JoinParty event', () => {
        expect(context.eventManager.send).toHaveBeenCalledWith({
          label: EventLabels.JoinParty,
          payload: expect.objectContaining({
            id: party.id,
            players: [expect.objectContaining({ id: context.player.id })],
          }),
        });
      });

      it('broadcasts PlayerJoin event', () => {
        const playerExpectation = expect.objectContaining({
          id: context.player.id,
          username: context.player.username,
        });

        expect(context.eventManager.broadcast).toHaveBeenCalledWith({
          label: EventLabels.PlayerJoin,
          payload: playerExpectation,
          to: expect.objectContaining({
            id: party.id,
            players: [playerExpectation],
          }),
        });
      });

      it('removes CreateParty and JoinParty events', () => {
        expect(context.eventManager.remove).toHaveBeenCalledWith(
          EventLabels.CreateParty,
          EventLabels.JoinParty
        );
      });

      it('adds LeaveParty and ChatMessage events', () => {
        expect(context.eventManager.listen).toHaveBeenCalledWith(
          leaveParty,
          chatMessage
        );
      });
    });

    describe('and the party does not exists', () => {
      beforeEach(() => {
        mocked(context.storage.parties.get).mockImplementation(
          () => undefined as any
        );
        runListener(context, joinParty, data);
      });

      it('sends proper error message', () => {
        expect(context.eventManager.send).toHaveBeenCalledWith({
          label: 'error',
          payload: { code: ErrorCodes.inexistentParty },
        });
      });
    });
  });
});
