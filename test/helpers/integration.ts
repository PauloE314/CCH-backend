import http from 'http';
import { Server } from 'socket.io';
import connect, {
  Socket,
  SocketOptions,
  ManagerOptions,
} from 'socket.io-client';
import setupWebSockets from '~/socket';
import { GameStorage } from '~/socket/GameStorage';
import { delay } from '~/utils';

type StartWSTestServer = () => Promise<{
  io: Server;
  port: number;
  storage: GameStorage;
  httpServer: http.Server;
}>;

const startWebSocketsTestServer: StartWSTestServer = () => {
  return new Promise(resolve => {
    const httpServer = http.createServer();
    const io = new Server(httpServer);
    const storage = new GameStorage();
    setupWebSockets(io, storage);

    httpServer
      .listen(0, () => {
        resolve({
          io,
          httpServer,
          port: (<any>httpServer.address()).port,
          storage,
        });
      })
      .on('error', () => {
        throw new Error();
      });
  });
};

interface ClientFactory {
  (params: {
    username: string;
    namespace?: string;
    params?: Partial<SocketOptions & ManagerOptions>;
    waitConnection?: false;
  }): Socket;
  (params: {
    username: string;
    namespace?: string;
    params?: Partial<SocketOptions & ManagerOptions>;
    waitConnection: true;
  }): Promise<Socket>;
}

// interface SafeEnv {
//   <T extends Function>(cb: T): T;
// }
interface WSTesterCBParams {
  io: Server;
  clientFactory: ClientFactory;
  done: (error?: any) => any;
  storage: GameStorage;
  // safeEnv: SafeEnv;
}

type Tester = (
  message: string,
  cb: (args: WSTesterCBParams) => void | Promise<void>
) => any;

const WStester: Tester = (message, cb) => {
  if (!cb) {
    it.todo(message);
    return;
  }

  test(message, done => {
    startWebSocketsTestServer().then(({ io, port, storage, httpServer }) => {
      const clients: Socket[] = [];

      const clientFactory = <ClientFactory>(data => {
        const namespace = data.namespace || '';
        const params = data.params || {};
        params.query = params.query || {};
        params.query.username = data.username;

        const newClient = connect(
          `http://localhost:${port}${namespace}`,
          params
        );
        clients.push(newClient);

        if (data.waitConnection) {
          return new Promise(resolve => {
            newClient.on('connect', () => {
              resolve(newClient);
            });
          });
        } else return newClient;
      });

      const end = (err?: any) => {
        clients.forEach(client => client.close());
        io.close();
        httpServer.close();
        done(err);
      };

      // const safeEnv: any = (unsafeCb: Function) => {
      //   try {
      //     unsafeCb();
      //   } catch (error) {
      //     end(error);
      //   }
      // };

      try {
        const res = cb({ io, clientFactory, done: end, storage });
        if (res instanceof Promise) res.catch(end);
      } catch (error) {
        end(error);
      }
    });
  });
};

const testWS: Tester = WStester;

const defaultClientParams = {
  username: 'Player',
};

/**
 * @deprecated
 */
export function testWSClient(
  message: string,
  cb: (params: WSTesterCBParams & { client: Socket }) => any
) {
  WStester(message, params => {
    const { done, clientFactory } = params;
    const client = clientFactory(defaultClientParams);

    client.on('connect', () => {
      const resp = cb({ ...params, client });
      if (resp instanceof Promise) resp.catch(done);
    });
  });
}

export async function act(cb: () => any, time = 50) {
  const t = time / 2;

  if (time === 0) cb();
  else {
    await delay(t);
    cb();
    await delay(t);
  }
}

export const getNthParty = (storage: GameStorage, index: number = 0) => {
  return Object.values(storage.parties.all())[index];
};

export {
  startWebSocketsTestServer,
  testWS,
  defaultClientParams,
  ClientFactory,
};
