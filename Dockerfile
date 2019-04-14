FROM node:8

COPY /musicman/package*.json ./musicman/
COPY /server/package*.json ./server/

COPY . /app/

WORKDIR /app

RUN cd server && npm install && cd .. && cd musicman && npm install && npm run build

EXPOSE 3000 3000
WORKDIR server
CMD [ "node", "server.js" ]