import { Server } from 'socket.io';
import connect, { Socket } from 'socket.io-client';

import Application from '~/app';

const port = 3001;

export function startWebSocketsTestServer(_application?: Application) {
  return new Promise<Server>(resolve => {
    const application = _application || new Application();
    const { io } = application;

    application.boot();
    application.run(port, () => resolve(io));
  });
}

type TestSocketCallBack = (
  io: Server,
  socket: Socket,
  resolve: () => any
) => any;

export function testSocket(message: string, cb: TestSocketCallBack) {
  it(message, done => {
    startWebSocketsTestServer().then(io => {
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

export function delay(n: number) {
  return new Promise<void>(resolve => setTimeout(resolve, n));
}
