# Segment Redis Proxy

This proxy is written in ES6 JavaScript using Node.js and provides an http interface for retrieving redis values. It supports caching retrieved values in local app memory for a configurable duration. In total, this project took around 15 hours.

## Building

To build and run this application, run `make build && make run` (or `make up`).

By default, the applcation will connect to Redis on `127.0.0.1:6379` and listen on port `8080`. To change this, see the `Configuration` section below. A sample `.env` file has been provided.

## Testing

This project currently contains two test variants: unit tests and integration tests.

To build and run integration tests, run `make test`. This will start the proxy and a local redis instance and then execute the application's integration (black box) tests.

To execute unit tests during development, run `npm run test`.

Integration tests exist to verify the app's ability to retrieve values from Redis. The test app sets random key/value pairs directly using the redis client, and then does a lookup via the app's API. The integration testing is relatively minimal given the small exposure of the app (one endpoint) and the existence of comprehensive unit tests for the custom data structures and cache.

## Architecture

This app primarily consists of an http server, a redis client, and a key/value cache. These components are injected into and orchestrated by the RedisProxy class. All components are owned by index.js. This allows for high testability.

### HTTP Server

Express is used to provide an http GET endpoint. GETs to the URI `/api/v1/cache/:key` will return the value associated with the key, or 404. The API currently uses JSON but could just as easily use a plain text format.

Concurrent requests are processed in parallel. If the configured maximum number of concurrent requests is reached, subsequent requests receive a 503. On startup, the HTTP Server is not started until the application has successfully connected to Redis.

### Redis Client

The redis client is responsible for connecting directly to the configured redis address/port. Other services (e.g. the http server) interact with redis via an intermediary interface (RedisProxy class). This allows the redis client and caching logic to be decoupled from other app logic. It also provides an interface that can be used with other transport mediums (like the "Redis client protocol" bonus requirement).

### Cache

The cache is interesting because it needs to provide fast lookups while also providing ordering. I built an LRUMap class which combines a hash map with a doubly linked list. This provides constant time (O(1)) lookup via the map, and constant time LRU retrieval via the doubly linked list. All data structure operations are constant time, including insert, update, delete, and size. The one tradeoff here is space- LRUMap's unsimplified space complexity is O(2n). This seems a fair tradeoff given this application's intended purpose.

The cache is also responsible for entry expiration and for removing the least recently used key (via the LRUMap) when capacity is reached. Entry expiration is currently passive- an entry's expiration time is only checked on entry retrieval.

### Configuration

Application config is specified via an `.env` file. Support for all requested configuration values is provided, including the maximum number of concurrent api requests. All config values are accessible via a config class (Config.js) owned by index.js.

## Requirements

All requirements listed in the spec have been implemented. Bonus requirement "parallel concurrent processing" has been implemented, however "Redis client protocol" has not. The code has been architectured with the "Redis client protocol" feature in mind and will be easy to extend.

## Future Improvements

In creating the integration tests, a copy of the Redis Client class had to be made in the `e2e` directory. This is due to the `src` directory being outside the context of the e2e Docker build. This solution is a hacky bandaid to the problem and should instead be implemented with a proper fix: either extracting `RedisClient.js` into a proper library, broadening the docker build context (by manual specifying the e2e Dockerfile) so that the file can be copied over at build time, or another approach.
