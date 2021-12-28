import { gameContextFactory } from '~/../test/factories/gameContext';
import { EventLabels } from '~/socket/EventManager';
import { GameContext } from '~/socket/GameContext';
import { runListener } from '~test/helpers/unit';
import { chatMessage } from '~/socket/listeners/chatMessage';

describe('chatMessage', () => {
  let context: GameContext;
  let data: { message: string };

  beforeEach(() => {
    context = gameContextFactory();
    data = { message: 'Hello World' };
  });

  it('calls Socket#on with correct label and callback', () => {
    chatMessage(context);
    expect(context.socket.on).toHaveBeenCalledWith(
      EventLabels.ChatMessage,
      expect.any(Function)
    );
  });

  describe('when chatMessage is called', () => {
    beforeEach(() => {
      context.player.partyId = '123456';
      runListener(context, chatMessage, data);
    });

    it('broadcasts ChatMessage event', () => {
      const player = {
        id: context.player.id,
        username: context.player.username,
      };

      expect(context.eventManager.broadcast).toHaveBeenLastCalledWith({
        label: EventLabels.ChatMessage,
        payload: {
          player,
          message: data.message,
        },
        to: context.player.partyId,
      });
    });
  });
});
