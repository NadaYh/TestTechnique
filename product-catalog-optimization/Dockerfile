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

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable for MongoDB connection
ENV MONGO_URI mongodb://mongo:27017/test-product-catalog

# Start the Node.js application
CMD ["npm", "start"]
