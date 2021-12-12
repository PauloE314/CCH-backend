import { EventLabels } from '~/socket/EventManager';
import { Party } from '~/socket/models/Party';
import { act, testWS } from '../../helpers/integration';

describe('Parties', () => {
  describe('Create new party', () => {
    testWS('stores party and sends its id', data => {
      const { clientFactory, storage, done } = data;
      const client = clientFactory({
        username: 'Player',
      });

      client.on(EventLabels.CreateParty, ({ partyId }) => {
        try {
          expect(typeof partyId).toBe('string');
          expect(storage.parties.get(partyId)).toBeInstanceOf(Party);
          done();
        } catch (error) {
          done(error);
        }
      });

      client.emit(EventLabels.CreateParty);
    });
  });

  describe('Join party', () => {
    testWS(
      'Sends incoming player data to other players',
      async ({ clientFactory, done }) => {
        const client = clientFactory({ username: 'Player' });
        const incoming = clientFactory({ username: 'Incoming' });

        client.on(EventLabels.PlayerJoin, data => {
          try {
            expect(data).toEqual(
              expect.objectContaining({
                id: incoming.id,
                username: 'Incoming',
              })
            );
            done();
          } catch (error) {
            done(error);
          }
        });

        client.on(EventLabels.CreateParty, ({ partyId }) => {
          incoming.emit(EventLabels.JoinParty, { partyId });
        });

        await act(() => client.emit(EventLabels.CreateParty), 50);
      }
    );
  });

  testWS(
    'Sends room data to incoming player',
    async ({ clientFactory, done }) => {
      console.log('data');

      const client = clientFactory({ username: 'Player' });
      const incoming = clientFactory({ username: 'Incoming' });

      incoming.on(EventLabels.JoinParty, data => {
        try {
          expect(data).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              players: expect.arrayContaining([
                expect.objectContaining({
                  id: client.id,
                  username: 'Player',
                }),
                expect.objectContaining({
                  id: incoming.id,
                  username: 'Incoming',
                }),
              ]),
              owner: expect.objectContaining({
                id: client.id,
                username: 'Player',
              }),
            })
          );
          done();
        } catch (error) {
          done(error);
        }
      });

      client.on(EventLabels.CreateParty, ({ partyId }) => {
        incoming.emit(EventLabels.JoinParty, { partyId });
      });

      await act(() => client.emit(EventLabels.CreateParty), 50);
    }
  );
});
