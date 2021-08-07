FROM node:12-slim

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 80

CMD ["npm", "start"]