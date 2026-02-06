FROM node:20-alpine

WORKDIR /app
COPY package*.json ./

RUN npm ci --omit=dev

COPY dist ./dist
COPY src/config/config.json ./src/config/

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]