FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["node", "src/index.js"]
