# Use uma imagem base oficial do Node.js
FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install prisma --save-dev

COPY prisma/schema.prisma ./

RUN npx prisma generate

COPY . .


EXPOSE 3000

CMD ["node", "build/server.js"]