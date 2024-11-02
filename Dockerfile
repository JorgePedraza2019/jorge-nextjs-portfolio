# Use the official Node.js image
FROM node:20.11.1

# Set the working directory
WORKDIR /usr/src/app

# Declare the NODE_ENV argument with a default value
ARG NODE_ENV=development

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
  libnss3 \
  libnspr4 \
  libdbus-1-3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libatspi2.0-0 \
  libgtk-3-0 \
  libx11-xcb1 \
  gstreamer1.0-tools \
  gstreamer1.0-plugins-base \
  gstreamer1.0-plugins-good \
  gstreamer1.0-plugins-bad \
  gstreamer1.0-plugins-ugly \
  woff2 \
  libvpx-dev \
  libopus0 \
  libharfbuzz-icu0 \
  libenchant-2-2 \
  libsecret-1-0 \
  libhyphen0 \
  libflite1 \
  libgles2-mesa \
  libmanette-0.2-0 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install Playwright dependencies
RUN npx playwright install

# Copy the rest of the application code
COPY . .

# Build the application for production if NODE_ENV is set to production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Expose the application port
EXPOSE 3000

# Default command (will be overridden by the command in docker-compose)
CMD ["npm", "start"]