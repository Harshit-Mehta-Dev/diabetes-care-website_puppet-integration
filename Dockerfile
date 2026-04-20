# Use a lightweight Node.js 20 image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy the server logic and public assets
COPY Server ./Server
COPY public ./public

# Expose the application port (matching server1.js)
EXPOSE 1012

# Set environment to production
ENV NODE_ENV=production
ENV PORT=1012

# Start the application
CMD ["node", "Server/server1.js"]
