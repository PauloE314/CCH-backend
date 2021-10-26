import express, { Express, json as jsonParser } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';

import routes from './routes';
import setupWebSockets from '~/socket';

export default class Application {
  express: Express;
  server: HTTPServer;
  io: SocketServer;

  constructor() {
    this.express = express();
    this.server = createServer(this.express);
    this.io = new SocketServer(this.server);
  }

  boot() {
    this.express.use(jsonParser());
    this.express.use(cors());
    this.express.use(routes);

    setupWebSockets(this.io);
  }

  run(port: Number | String, cb?: () => void) {
    this.server.listen(port, cb);
  }
}
