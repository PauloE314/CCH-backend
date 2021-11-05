import http from 'http';
import { Server } from 'socket.io';
import connect, {
  Socket,
  SocketOptions,
  ManagerOptions,
} from 'socket.io-client';
import setupWebSockets from '~/socket';
import inMemoryStorage from '~/socket/storage/inMemoryStorage';
import { delay } from '~/utils';

export function startWebSocketsTestServer() {
  return new Promise<[Server, number]>(resolve => {
    const httpServer = http.createServer();
    const io = new Server(httpServer);
    setupWebSockets(io, inMemoryStorage);

    httpServer
      .listen(0, () => resolve([io, (<any>httpServer.address()).port]))
      .on('error', () => {
        throw new Error();
      });
  });
}

interface IClientFactoryParams {
  namespace?: string;
  query?: { [key: string]: string };
  params?: Partial<SocketOptions & ManagerOptions>;
}

interface ITestWSPCallbackParams {
  io: Server;
  clientFactory: (params?: IClientFactoryParams) => Socket;
  done: () => any;
}

export function testWS(
  message: string,
  cb?: (args: ITestWSPCallbackParams) => any
) {
  if (!cb) {
    it.todo(message);
    return;
  }

  it(message, done => {
    startWebSocketsTestServer().then(([io, port]) => {
      const clients: Socket[] = [];

      const clientFactory = (data: IClientFactoryParams = {}) => {
        const namespace = data.namespace || '';
        const params = data.params || {};
        params.query = data.query || undefined;

        const newClient = connect(
          `http://localhost:${port}${namespace}`,
          params
        );
        clients.push(newClient);
        return newClient;
      };

      const end = (err?: any) => {
        clients.forEach(client => client.close());
        io.close();
        done(err);
      };

      try {
        const resp = cb({ io, clientFactory, done: end });
        if (resp instanceof Promise) resp.catch(end);
      } catch (error) {
        end(error);
      }
    });
  });
}

export const defaultClientParams: IClientFactoryParams = {
  query: { username: 'Player' },
};

export function testWSClient(
  message: string,
  cb?: (args: ITestWSPCallbackParams & { client: Socket }) => any
) {
  if (!cb) {
    testWS(message, cb);
    return;
  }

  testWS(message, async cbParams => {
    const client = cbParams.clientFactory(defaultClientParams);
    await cb({ ...cbParams, client });
  });
}

export async function act(cb: () => any, time = 50) {
  cb();
  await delay(time);
}
