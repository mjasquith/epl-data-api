FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src

COPY tsconfig.json ./

RUN npm run build

COPY src/config/config.json ./dist/config/

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]