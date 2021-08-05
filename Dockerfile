## Required command
## Download the node alpine version image (simplified and ligher version)
FROM node:alpine

## Defines the location where the app will stay on the container's disk
WORKDIR /usr/src/app

## Copies everything that starts with package and ends with .json, and everything that starts with yarn into the '/usr/app' folder
COPY package*.json yarn.* ./

# Execute yarn command, to install all dependencies and to create the node_modules folder
RUN yarn

## Copy everything in directory where the Dockerfile file is
## into the container's /usr/app folder
COPY . .

## Container will be listen accesses at port 3000
EXPOSE 3000

## Execute 'yarn dev' command to start the script that is in package.json
CMD yarn dev