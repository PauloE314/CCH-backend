import { mocked } from 'ts-jest/utils';
import { gameContextFactory } from '~/../test/factories/gameContext';
import { Party } from '~/socket/models/Party';
import { EventLabels } from '~/socket/EventManager';
import { GameContext } from '~/socket/GameContext';
import { createParty } from '~/socket/listeners/createParty';
import { leaveParty } from '~/socket/listeners/leaveParty';
import { chatMessage } from '~/socket/listeners/chatMessage';

describe('createParty', () => {
  let context: GameContext;

  beforeEach(() => {
    context = gameContextFactory();
  });

  it('calls Socket#on with correct label and callback', () => {
    createParty(context);
    expect(context.socket.on).toHaveBeenCalledWith(
      EventLabels.CreateParty,
      expect.any(Function)
    );
  });

  describe('when CreateParty is called', () => {
    let party: Party;

    beforeEach(() => {
      mocked(context.storage.parties.store).mockImplementation(
        p => (party = p)
      );

      createParty(context);
      const cb = mocked(context.socket.on).mock.calls[0][1];
      cb();
    });

    it('creates a new party', () => {
      expect(context.storage.parties.store).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          players: [context.player],
        })
      );
    });

    it('joins socket to party room', () => {
      expect(context.socket.join).toHaveBeenCalledWith(party.id);
    });

    it('sends CreateParty event with party id', () => {
      expect(context.eventManager.send).toHaveBeenCalledWith({
        label: EventLabels.CreateParty,
        payload: { partyId: party.id },
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
});
