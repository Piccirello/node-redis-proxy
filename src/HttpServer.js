const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const expressQueue = require('express-queue');

class HttpServer {
  constructor(port, redisProxy, maxConcurrentRequests) {
    this.port = port;
    this.redisProxy = redisProxy;
    this.maxConcurrentRequests = maxConcurrentRequests;
    this.app = express();
  }

  init() {
    this.setupMiddleware();
    this.setupRoutes();
  }

  run() {
    this.app.listen(this.port, () => console.log(`Listening on port ${this.port}`));
  }

  setupMiddleware() {
    // Security headers
    this.app.use(helmet());
    this.app.use(helmet.noCache());

    // parse application/json content-type
    this.app.use(express.json());

    // allow requests from all origins
    this.app.use(cors());

    // log HTTP requests
    this.app.use(morgan('combined'));

    // limit number of concurrent reqeuests
    this.app.use(expressQueue({
      activeLimit: this.maxConcurrentRequests,
      queuedLimit: 1,
    }));
  }

  setupRoutes() {
    this.app.get('/api/v1/cache/:key', async (req, res) => {
      const { key } = req.params;
      // TODO sanitize key? redis valid charset is wide. revisit this
      await this.redisProxy.get(key)
        .then(value => res.send({ value }))
        .catch(() => res.status(404).send());
    });

    // this must be the last route
    this.app.use((req, res, next) => {
      res.type('json');
      res.status(404).send();
    });
  }
}

module.exports = HttpServer;
