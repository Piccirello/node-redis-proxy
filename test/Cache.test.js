const Cache = require('../src/Cache');

test('overload cache', () => {
  const cache = new Cache(2, 3600);

  cache.set("1", "one");
  cache.set("2", "two");
  cache.set("3", "three");

  expect(cache.size()).toBe(2);

  expect(cache.exists("1")).toBe(false);
  expect(cache.exists("2")).toBe(true);
  expect(cache.exists("3")).toBe(true);

  expect(cache.get("1")).toBe(undefined);
  expect(cache.get("2")).toBe("two");
  expect(cache.get("3")).toBe("three");
});

test('at capacity', () => {
  const cache = new Cache(3, 3600);

  cache.set("1", "1");
  cache.set("2", "2");
  expect(cache.atCapacity()).toBe(false);
  cache.set("3", "3");
  expect(cache.atCapacity()).toBe(true);
  cache.set("4", "4");
  expect(cache.atCapacity()).toBe(true);
  cache.delete("4");
  expect(cache.atCapacity()).toBe(false);

  expect(cache.size()).toBe(2);
})

test('expired key', async () => {
  const expireTimeoutSeconds = 1;
  const cache = new Cache(3, expireTimeoutSeconds);

  cache.set("1", "1");
  cache.set("2", "2");

  expect(cache.get("1")).toBe("1");
  expect(cache.size()).toBe(2);
  const timeToSleep = (expireTimeoutSeconds + 1) * 1000;
  await new Promise(resolve => setTimeout(resolve, timeToSleep));
  expect(cache.get("1")).toBe(undefined);
  expect(cache.exists("1")).toBe(false);
  expect(cache.size()).toBe(1);
});
