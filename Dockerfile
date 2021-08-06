FROM node:12-slim

RUN mkdir -p /app

WORKDIR /app

COPY . .

RUN npm install -g serve

RUN npm install

# RUN npm run build

EXPOSE 3000
EXPOSE 5000

# CMD ["serve", "-s", "-l", "8080", "./build", "node", "server.js"]
CMD ["npm", "start", "&&", "node", "./backend/server.js"]