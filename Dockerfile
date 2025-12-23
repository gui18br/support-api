FROM node:20-alpine

WORKDIR /app

ENV CHOKIDAR_USEPOLLING=true

COPY package*.json ./
RUN npm install

CMD ["npm", "run", "start:dev"]