FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app/zipcode
WORKDIR /usr/src/app/zipcode

# Install app dependencies
COPY package.json /usr/src/app/zipcode
RUN npm install

# Bundle app source
COPY . /usr/src/app/zipcode

EXPOSE 8889
CMD [ "npm", "start" ]
