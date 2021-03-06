require('dotenv').config();
const fetch = require('node-fetch');
const RedisClient = require('./RedisClient');
const uuidv4 = require('uuid/v4');

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8080;

const redisClient = new RedisClient(process.env.BACKING_REDIS_ADDRESS, process.env.BACKING_REDIS_PORT);;

beforeEach(async () => {
  await redisClient.init();
})

afterEach(async () => {
  await redisClient.close();
});

function getUrl(key) {
  return `http://${host}:${port}/api/v1/cache/${key}`;
}

async function setValue(client, key, value) {
  return client.set(key, value);
}

async function getValue(key) {
  return fetch(getUrl(key))
    .then(resp => resp.json())
    .then(resp => resp.value)
    .catch(() => null);
}

async function deleteValue(key) {
  return fetch(getUrl(key), {
    method: 'DELETE',
  });
}

test('set and get values', async () => {
  const key = uuidv4();
  const key2 = uuidv4();

  const value = uuidv4();
  const value2 = uuidv4();

  // check basic set/get
  await getValue(key)
    .then(val => expect(val).toBe(null));
  await getValue(key2)
    .then(val => expect(val).toBe(null));
  await setValue(redisClient, key, value);
  await setValue(redisClient, key2, value);
  await getValue(key)
    .then(val => expect(val).toBe(value));
  await getValue(key2)
    .then(val => expect(val).toBe(value));

  await redisClient.close();
});
