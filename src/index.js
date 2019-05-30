require('dotenv').config();

const Config = require('./Config');
const HttpServer = require('./HttpServer');
const RedisClient = require('./RedisClient');
const RedisProxy = require('./RedisProxy');
const Cache = require('./Cache');

const applicationName = 'Segment Redis Proxy';

async function main() {
  console.log(`Starting ${applicationName}...`);

  const address = Config.getBackingRedisAddress();
  const port = Config.getBackingRedisPort();
  const redisClient = new RedisClient(address, port);
  await redisClient.init();

  const cache = new Cache(Config.getCacheCapacity(), Config.getCacheExpirySeconds());
  const redisProxy = new RedisProxy(redisClient, cache);

  const httpServer = new HttpServer(Config.getPort(), redisProxy, Config.getMaxConcurrentRequests());
  httpServer.init();
  httpServer.run();

  process.on('SIGINT', async () => {
    await redisClient.close();
    console.log(`${applicationName} is shutting down`);
    process.exit();
  });
}

main();
