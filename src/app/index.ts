import express, { Express, json as jsonParser } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';

import routes from './routes';

export default class Application {
  express: Express;
  server: HTTPServer;
  socket: SocketServer;

  constructor() {
    this.express = express();
    this.server = createServer(this.express);
    this.socket = new SocketServer(this.server);
  }

  boot() {
    this.express.use(jsonParser());
    this.express.use(cors());
    this.express.use(routes);
  }

  run(port: Number | String) {
    this.server.listen(port);
  }
}
