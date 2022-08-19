FROM node:18-alpine

# Create app directory
RUN mkdir -p /home/atri/
WORKDIR /home/atri/

# Install depedencies
COPY package.json yarn.lock ./
RUN yarn install
RUN yarn global add nodemon
RUN apk add inotify-tools

# Copy All Data
COPY . .
EXPOSE 8080

CMD [ "yarn", "run", "start" ]