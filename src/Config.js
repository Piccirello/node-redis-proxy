const defaults = {
  BACKING_REDIS_ADDRESS: '127.0.0.1',
  BACKING_REDIS_PORT: 6379,
  CACHE_EXPIRY_SECONDS: 3600,
  CACHE_CAPACITY: 10,
  PORT: 8080,
  MAX_CONCURRENT_REQUESTS: 5,
};

class Config {
  static getBackingRedisAddress() {
    return process.env.BACKING_REDIS_ADDRESS || defaults.BACKING_REDIS_ADDRESS;
  }

  static getBackingRedisPort() {
    return process.env.BACKING_REDIS_PORT || defaults.BACKING_REDIS_PORT;
  }

  static getCacheExpirySeconds() {
    return process.env.CACHE_EXPIRY_SECONDS || defaults.CACHE_EXPIRY_SECONDS;
  }

  static getCacheCapacity() {
    return process.env.CACHE_CAPACITY || defaults.CACHE_CAPACITY;
  }

  static getPort() {
    return process.env.PORT || defaults.PORT;
  }

  static getMaxConcurrentRequests() {
    return process.env.MAX_CONCURRENT_REQUESTS || defaults.MAX_CONCURRENT_REQUESTS;
  }
}

module.exports = Config;
