FROM node:12-slim

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN npm install -g serve

RUN npm install

RUN npm run build

EXPOSE 8080

CMD ["serve", "-s", "-l", "8080", "./build"]