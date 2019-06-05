# Redis Proxy

This is a transparent Redis proxy written in ES6 JavaScript using Node.js. It provides an http interface for retrieving values from a single Redis instance. The proxy supports in-memory caching of retrieved values for a configurable duration. It also supports Least recently used (LRU) cache eviction in O(n) space and time complexity.

This coding assignment was completed as a job interview for a San Francisco-based startup. In total, this project took around 20 hours. This README was written by me; the requirements have been synthesized from a longer PDF spec document.

## Requirements:

Build a transparent Redis proxy service with the following requirements:

- provide an http `GET` endpoint for retrieving values from Redis
- local in-memory fixed-size cache w/ item expiration and LRU eviction
- connect to single instance of Redis, configurable at startup
- parallel processing of client requests w/ a configurable max number of concurrent requests
- single-click build and test w/ `make test`
- can be built on Linux and macOS with `make`, `docker`, `docker-compose`, and `bash`
- end-to-end/black-box/integration testing of proxy

## Building

To build and run this application, run `make build && make run` (or `make up`). The build will result in the creation of a docker image. The docker build is a fairly straightforward `npm install`.

By default, the applcation will connect to Redis on `127.0.0.1:6379` and listen on port `8080`. A sample `.env` file has been provided. For more info, see the `Configuration` section.

## Testing

This project currently contains unit tests and integration tests.

To run unit tests during development, run `npm run test`.

To build and run integration tests, run `make test`. This will start the proxy and a local Redis instance with `docker-compose` before executing the end-to-end tests.

### Configuration

Application config is specified via an `.env` file. All config values are accessible via a config class (Config.js) owned by index.js.

## Architecture

This app primarily consists of an http server, a Redis client, a local cache (a map), and a Redis proxy component. The proxy component coordinates between the Redis client and the local cache. An instance of the proxy class is provided to the http server. All components are owned and initialized by `index.js`. Components are injected, as needed, to allow for separation of concerns and high code testability.

### HTTP Server

Express is used to service HTTP requests. `GET` requests to the URI `/api/v1/cache/:key` will receive the `key`'s associated value as provided by the Proxy component, or a 404 if not found. The API currently uses JSON but could just as easily use a plain-text format.

Concurrent requests are processed in parallel, up to a limit. If the configured maximum number of concurrent requests is reached, subsequent requests will receive a 503.

On app startup, the HTTP Server is not started until after a connection to Redis has been established

### Redis Client

The Redis client is responsible for connecting directly to the configured Redis address/port. It wraps the node `Redis` library and support asynchronous operations via `async`.

### Cache

The cache is interesting because it needs to provide fast lookups and some amount of ordering. It achieves this by utilizing a map and a doubly linked list. Each new key-value pair is inserted at the head of the list, and then the list node is stored in the map. This provides O(1) (constant time) key-value lookup via the map, and constant time LRU retrieval via the list's tail. All data structure operations are constant time, including insert, read, update, delete, and size. The one tradeoff here is space; each key-value pair requires storage in two data strutures. This results in an unsimplified space complexity of O(2n). Given this application's intended purpose as a cache, this seems a fair tradeoff.

The cache is also responsible for entry expiration and for ejecting the least recently used entry upon reaching capacity. Entry expiration is currently passive- an entry's expiration time is only checked during retrieval. LRU eviction is not affected by this.

## Future Improvements

1. Support GETs via the native Redis protocol. This was a bonus requirement that I chose not to implement for time-related reasons. I think it'd be cool to support connections from a real Redis client. Not necessarily practical, but pretty cool.
1. In creating the integration tests, a one-time copy of the Redis Client class had to be made into the `e2e` directory. This is due to the `src` directory being outside the context of the e2e tests' Dockerfile. The one-time copy is a hacky bandaid and will break if `src/RedisClient.js` is ever modified. A proper fix should be implemented that allows copying the file at runtime, accessing the file via a proper library, or some other approach.
