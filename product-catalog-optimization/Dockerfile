# Use an official Node.js runtime as a parent image
FROM node:18.14-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Create a non-root user
RUN addgroup -g 1001 appuser && adduser -u 1001 -G appuser -s /bin/sh -D appuser

# Switch to the non-root user
USER appuser

# Define environment variable for MongoDB connection
ENV MONGO_URI mongodb://nada0809:213JFT0079@mongo:27017/test-product-catalog

# Start the Node.js application
CMD ["npm", "start"]
