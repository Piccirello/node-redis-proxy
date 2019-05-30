const LRUMap = require('../src/LRUMap');

test('insert', () => {
  const map = new LRUMap();

  map.insert("1", "one");
  map.insert("2", "two");
  map.insert("3", "three");

  expect(map.size()).toBe(3);

  expect(map.exists("1")).toBe(true);
  expect(map.exists("2")).toBe(true);
  expect(map.exists("3")).toBe(true);

  expect(map.get("1")).toBe("one");
  expect(map.get("2")).toBe("two");
  expect(map.get("3")).toBe("three");
});

test('remove', () => {
  const map = new LRUMap();

  map.insert("1", "one");
  map.insert("2", "two");
  map.insert("3", "three");

  map.delete("3");
  expect(map.size()).toBe(2);
  expect(map.exists("3")).toBe(false);

  map.delete("doesnotexist");
  expect(map.size()).toBe(2);

  map.clear();
  expect(map.size()).toBe(0);
});

test('insert existing key', () => {
  const map = new LRUMap();

  map.insert("1", "one");
  map.insert("2", "two");
  map.insert("3", "three");
  map.insert("1", "one-one");

  expect(map.size()).toBe(3);

  expect(map.get("1")).toBe("one-one");
  expect(map.get("2")).toBe("two");
  expect(map.get("3")).toBe("three");
});

test('deleting the lru', () => {
  const map = new LRUMap();

  map.insert("1", "1");
  map.insert("2", "2");
  map.insert("3", "3");
  map.insert("4", "4");
  map.insert("5", "5");

  map.deleteLRU(); //  2 -> 3 -> 4 -> 5

  expect(map.exists("1")).toBe(false);
  expect(map.exists("2")).toBe(true);
  expect(map.exists("3")).toBe(true);
  expect(map.exists("4")).toBe(true);
  expect(map.exists("5")).toBe(true);

  map.get("2"); // 3 -> 4 -> 5 -> 2
  map.deleteLRU(); //  4 -> 5 -> 2

  expect(map.size()).toBe(3);
  expect(map.exists("2")).toBe(true);
  expect(map.exists("3")).toBe(false);
  expect(map.exists("4")).toBe(true);
  expect(map.exists("5")).toBe(true);
});
