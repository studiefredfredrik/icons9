FROM node:8

COPY . /app/

WORKDIR /app

RUN cd /app/src && npm install && cd /app/src/icons9-frontend && npm install && npm run build

WORKDIR /app/src
CMD [ "node", "server.js" ]