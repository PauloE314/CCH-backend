import http from 'http';
import { Server } from 'socket.io';
import connect, { Socket } from 'socket.io-client';
import setupWebSockets from '~/socket';
import inMemoryStorage from '~/socket/storage/inMemoryStorage';

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

type TestSocketCallBack = (
  io: Server,
  socket: Socket,
  resolve: () => any
) => any;

export function testSocket(message: string, cb: TestSocketCallBack) {
  it(message, done => {
    startWebSocketsTestServer().then(([io, port]) => {
      const client = connect(`http://localhost:${port}`);
      const end = (err?: any) => {
        client.close();
        io.close();
        done(err);
      };

      try {
        const resp = cb(io, client, end);
        if (resp instanceof Promise) resp.catch(end);
      } catch (error) {
        end(error);
      }
    });
  });
}
