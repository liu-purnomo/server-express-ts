FROM node:lts-alpine3.17

WORKDIR /dist

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production && npm cache clean --force

COPY . .

CMD ["npm", "run", "start"]