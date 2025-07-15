FROM node:22

COPY ./src /app/src

WORKDIR /app/src
RUN npm ci

WORKDIR /app/src/icons9-frontend
RUN npm ci
RUN npm run build

WORKDIR /app/src
USER node
CMD [ "node", "server.js" ]