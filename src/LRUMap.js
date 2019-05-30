const LinkedList = require('./LinkedList');

class LRUMap {
  constructor() {
    this.map = {};
    this.list = new LinkedList();
  }

  get(key) {
    const node = this.map[key];
    if ((node === undefined) || (node.value() === undefined)) {
      return undefined;
    }

    this.list.promoteToHead(node);
    return node.value();
  }

  insert(key, value) {
    if (this.exists(key)) {
      this.delete(key);
    }

    const node = this.list.insert(key, value);
    this.map[key] = node;
  }

  delete(key) {
    const node = this.map[key];
    if (node !== undefined) {
      this.list.remove(node);
    }

    this.map[key] = undefined;
  }

  deleteLRU() {
    const node = this.list.tail();
    this.delete(node.key());
  }

  size() {
    return this.list.size();
  }

  exists(key) {
    return this.map[key] !== undefined;
  }

  clear() {
    this.map = {};
    this.list = new LinkedList();
  }
}

module.exports = LRUMap;
