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

type TestSocketCallBack = (socket: Socket, resolve: () => any) => any;

export function testSocket(message: string, cb: TestSocketCallBack) {
  it(message, done => {
    const client = connect(`http://localhost:${port}`);
    try {
      cb(client, () => {
        client.close();
        done();
      });
    } catch (error) {
      client.close();
      done(error);
    }
  });
}

export function delay(n: number) {
  return new Promise<void>(resolve => setTimeout(resolve, n));
}
