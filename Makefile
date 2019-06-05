.PHONY: build run test

build:
	docker build -f Dockerfile -t piccirello/segment-redis-proxy .

run:
	docker run --rm -p 8080:8080 --env-file .env piccirello/segment-redis-proxy

up: build run

test:
	docker-compose up --build --exit-code-from tests
