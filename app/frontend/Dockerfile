# Use the official Node.js image from the Docker Hub
FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies with --force
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on (optional, adjust based on your app)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
