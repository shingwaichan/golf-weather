FROM node:alpine

RUN mkdir -p /usr/src/app/weather
WORKDIR /usr/src/app/weather

COPY package.json /usr/src/app/weather
RUN npm install

COPY accweather.js /usr/src/app/weather

EXPOSE 8888
CMD [ "npm", "start" ]
