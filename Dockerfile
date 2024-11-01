# Use the official Node.js image
FROM node:20.11.1

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application (can be enabled or disabled depending on the environment)
RUN npm run build

# Expose the application port
EXPOSE 3000

# Default command (will be overridden by the command in docker-compose)
CMD ["npm", "start"]