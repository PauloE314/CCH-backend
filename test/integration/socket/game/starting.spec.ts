import { EventLabels } from '~/socket/EventManager';
import { delay } from '~/utils';
import { testWS } from '~test/helpers/integration';
import { beforeStartScenery, multipleClientAssert } from '.';

describe('Starting game tests', () => {
  describe('Ready', () => {
    testWS(
      'sends ready message to other clients',
      async ({ storage, clientFactory, done }) => {
        const clients = await beforeStartScenery(clientFactory, storage, [
          'Player1',
          'Player2',
          'Player3',
        ]);

        const playerData = { id: clients[0].id, username: 'Player1' };

        const checkReady = multipleClientAssert(2, done, data => {
          expect(data).toEqual({
            ready: true,
            player: playerData,
          });
        });

        const checkNotReady = multipleClientAssert(2, done, data => {
          expect(data).toEqual({
            ready: false,
            player: playerData,
          });
        });

        clients[1].on(EventLabels.Ready, checkReady);
        clients[2].on(EventLabels.Ready, checkReady);
        clients[0].emit(EventLabels.Ready);

        await delay(100);

        clients[1].on(EventLabels.Ready, checkNotReady);
        clients[2].on(EventLabels.Ready, checkNotReady);
        clients[0].emit(EventLabels.Ready);
      }
    );
  });
});
