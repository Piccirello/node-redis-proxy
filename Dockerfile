FROM node:10.13-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN apk add --no-cache git
RUN npm install --silent
COPY . .
EXPOSE 8080
CMD npm start
