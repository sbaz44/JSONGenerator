
#import OS
FROM node:18.13.0-alpine

#Select a working directory
WORKDIR /usr/app

# Copy package.json from current directory to container
COPY ./package.json ./


# install the dependency in package.json
RUN npm install --legacy-peer-deps

# Copy the src file
COPY ./ ./

#start the frontend
CMD [ "npm","start" ]