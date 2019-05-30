class Node {
  constructor(key, value) {
    this._key = key;
    this._value = value;
    this.next = null;
    this.previous = null;
  }

  key() {
    return this._key;
  }

  value() {
    return this._value;
  }
}

class LinkedList {
  constructor() {
    this._head = null;
    this._tail = null;
    this._size = 0;
  }

  size() {
    return this._size;
  }

  /**
   * The most recently inserted node
   */
  head() {
    return this._head;
  }

  /**
   * The least recently inserted node
   */
  tail() {
    return this._tail;
  }

  /**
   * Make node the head of the list
   */
  promoteToHead(node) {
    this._removeFromList(node);
    this._makeHead(node);
  }

  _makeHead(node) {
    node.next = null;
    node.previous = this._head;
    if (node.previous !== null) {
      node.previous.next = node;
    }
    this._head = node;

    if (this._tail === null) {
      this._tail = node;
    }
  }

  _removeFromList(node) {
    if (node.previous) {
      node.previous.next = node.next;
    }
    if (node.next) {
      node.next.previous = node.previous;
    }

    if (node === this._head) {
      this._head = node.previous;
    }
    if (node === this._tail) {
      this._tail = node.next;
    }
  }

  /** Insert a new key into the head of the list. This key must not already exist in the list, or size miscounting will occur
   * @param {String} key this key must not already exist in the list
   * @param {String} value
   */
  insert(key, value) {
    const node = new Node(key, value);
    this._makeHead(node);

    // a duplicate key will cause the size to be erroneously incremented
    this._size += 1;
    return node;
  }

  remove(node) {
    if (!node) {
      return null;
    }

    this._removeFromList(node);

    this._size -= 1;
    return node;
  }
}

module.exports = LinkedList;
