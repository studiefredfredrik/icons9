FROM node:20

COPY ./src /app/src

WORKDIR /app/src
RUN npm ci

WORKDIR /app/src/icons9-frontend
RUN npm ci
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

WORKDIR /app/src
USER node
CMD [ "node", "server.js" ]