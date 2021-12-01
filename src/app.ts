import express, { Express, json as jsonParser } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import 'reflect-metadata';

import routes from './web/routes';
import setupWebSockets from '~/socket';
import { GameStorage } from '~/socket/storage';

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

    setupWebSockets(this.io, new GameStorage());
  }

  run(port: Number | String, cb?: () => void) {
    this.server.listen(port, cb);
  }
}
