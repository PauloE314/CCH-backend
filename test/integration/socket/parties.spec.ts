import { EventLabels } from '~/socket/EventManager';
import { Party } from '~/socket/models/Party';
import { delay } from '~/utils';
import { act, getNthParty, testWS } from '../../helpers/integration';

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

    testWS(
      'Sends room data to incoming player',
      async ({ clientFactory, done }) => {
        const client = clientFactory({ username: 'Player' });
        const incoming = clientFactory({ username: 'Incoming' });

        const expectedResponse = () =>
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
          });

        incoming.on(EventLabels.JoinParty, data => {
          try {
            expect(data).toEqual(expectedResponse());
            done();
          } catch (error) {
            done(error);
          }
        });

        client.on(EventLabels.CreateParty, ({ partyId }) => {
          incoming.emit(EventLabels.JoinParty, { partyId });
        });

        client.emit(EventLabels.CreateParty);
      }
    );
  });

  describe('Leave Party', () => {
    testWS(
      'Sends leave message to other clients and removes player',
      async ({ clientFactory, done, storage }) => {
        const client = clientFactory({ username: 'Player' });
        const incoming = clientFactory({ username: 'Incoming' });
        let partyId: string;

        client.on(EventLabels.CreateParty, data => {
          partyId = data.partyId;
          incoming.emit(EventLabels.JoinParty, { partyId });
        });

        client.emit(EventLabels.CreateParty);

        await delay(100);
        client.on(EventLabels.LeaveParty, data => {
          try {
            const party = storage.parties.get(partyId);
            expect(
              party.players.find(p => p.id === incoming.id)
            ).toBeUndefined();
            expect(data).toEqual(
              expect.objectContaining({
                player: { id: incoming.id, username: 'Incoming' },
                party: {
                  id: party.id,
                  players: [{ id: client.id, username: expect.any(String) }],
                  owner: { id: client.id, username: expect.any(String) },
                },
              })
            );
            done();
          } catch (error) {
            done(error);
          }
        });

        incoming.emit(EventLabels.LeaveParty);
      }
    );
  });

  describe('Chat message', () => {
    testWS(
      'Sends message to other clients',
      async ({ clientFactory, storage, done }) => {
        const clients = [
          clientFactory({ username: 'Player1' }),
          clientFactory({ username: 'Player2' }),
          clientFactory({ username: 'Player3' }),
        ];
        let assertCount = 0;

        const check = (data: any) => {
          expect(data).toEqual({ message: 'Hello' });
          assertCount++;
          if (assertCount === 2) done();
        };

        clients[0].emit(EventLabels.CreateParty);
        await delay(200);

        const partyId = getNthParty(storage).id;
        clients[1].emit(EventLabels.JoinParty, { partyId });
        clients[2].emit(EventLabels.JoinParty, { partyId });
        await delay(50);

        clients[1].on(EventLabels.ChatMessage, check);
        clients[2].on(EventLabels.ChatMessage, check);

        clients[0].emit(EventLabels.ChatMessage, { message: 'Hello' });
      }
    );
  });

  describe('Disconnect', () => {
    testWS(
      'Sends message to other clients',
      async ({ clientFactory, storage, done }) => {
        const clients = [
          clientFactory({ username: 'Player1' }),
          clientFactory({ username: 'Player2' }),
          clientFactory({ username: 'Player3' }),
        ];
        let assertCount = 0;
        let partyId: string;

        const check = (data: any) => {
          try {
            expect(data).toEqual({
              player: { id: expect.any(String), username: 'Player1' },
              party: {
                id: partyId,
                players: [expect.any(Object), expect.any(Object)],
                owner: { id: clients[1].id, username: 'Player2' },
              },
            });
            assertCount++;
            if (assertCount === 2) done();
          } catch (error) {
            done(error);
          }
        };

        clients[0].emit(EventLabels.CreateParty);
        await delay(200);

        partyId = getNthParty(storage).id;
        clients[1].emit(EventLabels.JoinParty, { partyId });
        clients[2].emit(EventLabels.JoinParty, { partyId });
        await delay(50);

        clients[1].on(EventLabels.LeaveParty, check);
        clients[2].on(EventLabels.LeaveParty, check);

        clients[0].disconnect();
      }
    );
  });
});
