#!/bin/sh

cd /usr/src/app/
npm run start &
PID=$!
./node_modules/jest/bin/jest.js ./integration-tests/
kill $PID
