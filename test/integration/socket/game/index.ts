import { EventLabels } from '~/socket/EventManager';
import { GameStorage } from '~/socket/GameStorage';
import { delay } from '~/utils';
import { ClientFactory } from '~test/helpers/integration';

export const beforeStartScenery = async (
  clientFactory: ClientFactory,
  storage: GameStorage,
  usernames: string[] = ['Player1', 'Player2', 'Player3']
) => {
  const clients = usernames.map(username => clientFactory({ username }));
  clients[0].emit(EventLabels.CreateParty);
  await delay(100);

  const partyId = Object.values(storage.parties.all())[0];
  clients.map(client => client.emit(EventLabels.JoinParty, { partyId }));

  await delay(50);
  return clients;
};

export const multipleClientAssert = (
  amount: number,
  done: (error?: any) => any,
  asserter: (data: any) => any
) => {
  let assertCount = 0;

  return async (data: any) => {
    try {
      await asserter(data);
      assertCount++;
      if (assertCount === amount) done();
    } catch (error) {
      done(error);
    }
  };
};
