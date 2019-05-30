const { promisify } = require('util');
const redis = require('redis');

class RedisClient {
  constructor(host, port) {
    this.host = host;
    this.port = port;
  }

  async init() {
    console.log(`Connecting to redis instance ${this.host}:${this.port}`);

    this.client = redis.createClient(this.port, this.host);
    const connected = new Promise((resolve) => {
      this.client.on('ready', () => {
        console.log('Connected to redis');
        resolve();
      });
    });
    this.client.on('error', console.error);

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.quitAsync = promisify(this.client.quit).bind(this.client);

    return connected;
  }

  async close() {
    console.log('Closing connecting to redis');
    return this.quitAsync();
  }

  async get(key) {
    const value = await this.getAsync(key)
      .catch(() => null);
    if (value === null) {
      return Promise.reject();
    }

    return Promise.resolve(value);
  }

  async set(key, value) {
    return this.setAsync(key, value);
  }

  del(key) {
    return this.client.del(key);
  }
}

module.exports = RedisClient;
