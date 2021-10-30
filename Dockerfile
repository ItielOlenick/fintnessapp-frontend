FROM node:lts-alpine as build
WORKDIR /.
ENV PATH="./node_modules/.bin:$PATH"
# ENV CHOKIDAR_USEPOLLING=true
COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY . .

CMD ["npm", "start"]