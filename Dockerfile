# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose app on port 3000
EXPOSE 3000

CMD ["node", "src/index.js"]
