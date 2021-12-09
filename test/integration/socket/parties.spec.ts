import { EventLabels } from '~/socket/EventManager';
import { Party } from '~/socket/models/Party';
import { delay } from '~/utils';
import { act, testWS } from '../../helpers/integration';

describe('Parties', () => {
  // it('foo', done => {
  //   const cb = () => {
  //     try {
  //       expect(typeof undefined).toBe('string');
  //       done();
  //     } catch (error) {
  //       done(error);
  //     }
  //   };

  //   delay(100).then(cb);
  // });

  describe('Create new party', () => {
    testWS('stores party and sends its id', data => {
      const { clientFactory, storage, done } = data;
      const client = clientFactory({
        username: 'Player',
      });

      client.on(EventLabels.CreateParty, partyId => {
        try {
          expect(typeof undefined).toBe('string');
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
    testWS('joins party and sends its id', async ({ clientFactory, done }) => {
      const client = clientFactory({ username: 'Player' });

      client.on(EventLabels.JoinParty, data => {
        expect(data).toEqual({
          ownerId: expect.any(String),
          allPlayers: expect.arrayContaining([
            expect.objectContaining({ username: 'Player' }),
            expect.objectContaining({ username: 'Incoming' }),
          ]),
          player: expect.objectContaining({ username: 'Incoming' }),
        });

        done();
      });

      client.on(EventLabels.CreateParty, partyId => {
        const incoming = clientFactory({ username: 'Incoming' });
        incoming.emit(EventLabels.JoinParty, { partyId });
      });

      await act(() => client.emit(EventLabels.CreateParty), 150);
    });
  });
});
