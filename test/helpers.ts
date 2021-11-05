import http from 'http';
import { Server } from 'socket.io';
import connect, { Socket } from 'socket.io-client';
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

type TTestSocketCallBack = (args: {
  io: Server;
  client: Socket;
  clientFactory: () => Socket;
  done: () => any;
}) => any;

export function testSocket(message: string, cb?: TTestSocketCallBack) {
  if (!cb) {
    it.todo(message);
    return;
  }

  it(message, done => {
    startWebSocketsTestServer().then(([io, port]) => {
      const clients: Socket[] = [];

      const clientFactory = (namespace = '') => {
        const newClient = connect(`http://localhost:${port}${namespace}`);
        clients.push(newClient);
        return newClient;
      };

      const end = (err?: any) => {
        clients.forEach(client => client.close());
        io.close();
        done(err);
      };

      const client = clientFactory();

      try {
        const resp = cb({ io, client, clientFactory, done: end });
        if (resp instanceof Promise) resp.catch(end);
      } catch (error) {
        end(error);
      }
    });
  });
}

export async function act(cb: () => any, time = 50) {
  cb();
  await delay(time);
}
