class RedisProxy {
  constructor(redisClient, cache) {
    this.redisClient = redisClient;
    this.cache = cache;
  }

  /**
   * Retrieve value from the local cache/redis
   * @param {String} key
   */
  async get(key) {
    const cachedValue = this.cache.get(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const redisValue = await this.redisClient.get(key)
      .catch((err) => {
        console.error(err);
        return undefined;
      });

    if (redisValue === undefined) {
      return Promise.reject();
    }

    this.cache.set(key, redisValue);
    return redisValue;
  }
}

module.exports = RedisProxy;
