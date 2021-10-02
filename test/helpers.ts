import { Server } from 'socket.io';
import connect from 'socket.io-client';

import Application from '../src/app';

const port = 3001;

export function startWebSocketsTestServer(_application?: Application) {
  return new Promise<Server>(resolve => {
    const application = _application || new Application();
    const { io } = application;

    application.boot();
    application.run(port, () => resolve(io));
  });
}

export function startWebSocketsTestClient() {
  return connect(`http://localhost:${port}`);
}
