

# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Create a non-root user
RUN addgroup -g 1001 appuser && adduser -u 1001 -G appuser -s /bin/sh -D appuser

# Switch to the non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables for MongoDB connection
ENV MONGO_USERNAME=$MONGO_USERNAME
ENV MONGO_PASSWORD=$MONGO_PASSWORD
ENV MONGO_HOST=$MONGO_HOST
ENV MONGO_PORT=$MONGO_PORT
ENV MONGO_DATABASE=$MONGO_DATABASE

# Start the Node.js application
CMD ["npm", "start"]
