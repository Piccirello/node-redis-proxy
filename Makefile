.PHONY: build run test

build:
	docker build -f Dockerfile -t piccirello/segment-redis-proxy .

run:
	docker run --rm -p 8080:8080 --env-file .env piccirello/segment-redis-proxy

up: build run

test: build
	echo "Running unit tests"
	docker run --rm --env-file .env -it piccirello/segment-redis-proxy /usr/src/app/node_modules/jest/bin/jest.js ./test/
	echo "Running integration tests"
	docker run --rm --env-file .env -it piccirello/segment-redis-proxy /usr/src/app/integration-tests/run.sh
