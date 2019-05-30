const LRUMap = require('./LRUMap');

class CachedObject {
  constructor(value, expiration) {
    this._value = value;
    this._expiration = expiration;
  }

  value() {
    return this._value;
  }

  isExpired() {
    return new Date() > this._expiration;
  }
}

class Cache {
  static getExpiration(expirySeconds) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + (expirySeconds * 1000));
    return expiration;
  }

  constructor(capacity, expirySeconds) {
    this.capacity = capacity;
    this.expirySeconds = expirySeconds;
    this.map = new LRUMap();
  }

  get(key) {
    const object = this.map.get(key);
    if (object === undefined) return undefined;

    if (object.isExpired()) {
      this.map.delete(key);
      return undefined;
    }

    return object.value();
  }

  set(key, value) {
    if (this.atCapacity() && !this.map.exists(key)) {
      this.map.deleteLRU();
    }

    const expiration = Cache.getExpiration(this.expirySeconds);
    const objectToCache = new CachedObject(value, expiration);
    this.map.insert(key, objectToCache);
  }

  exists(key) {
    return this.map.exists(key);
  }

  delete(key) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }

  size() {
    return this.map.size();
  }

  atCapacity() {
    return this.map.size() >= this.capacity;
  }
}

module.exports = Cache;
