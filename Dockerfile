# Dockerfile for React Native Frontend (Metro Server)

# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Expose the Metro bundler port
EXPOSE 8081

# The command to start the Metro server
# Using --host 0.0.0.0 is crucial to allow connections from outside the container
CMD ["npm", "start", "--", "--host", "0.0.0.0"] 