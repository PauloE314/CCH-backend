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
  username?: string;
  params?: Partial<SocketOptions & ManagerOptions>;
}

interface IWSTesterParams {
  io: Server;
  clientFactory: (params?: IClientFactoryParams) => Socket;
  done: () => any;
}

export const defaultClientParams: IClientFactoryParams = {
  username: 'Player',
};

const WStester = (message: string, cb: (args: IWSTesterParams) => any) => {
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
        params.query = params.query || {};

        if (data.username) {
          params.query.username = data.username;
        }

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
        cb({ io, clientFactory, done: end });
      } catch (error) {
        end(error);
      }
    });
  });
};

export function testWS(message: string, cb: (params: IWSTesterParams) => any) {
  WStester(message, params => {
    const { done } = params;

    const resp = cb(params);
    if (resp instanceof Promise) resp.catch(done);
  });
}

export function testWSClient(
  message: string,
  cb: (params: IWSTesterParams & { client: Socket }) => any
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

  await delay(t);
  cb();
  await delay(t);
}
