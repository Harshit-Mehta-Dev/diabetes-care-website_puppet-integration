# Use Node.js 20 slim image as base
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application source code
COPY Server ./Server
COPY public ./public

# Expose the application port (defaulting to 1012 as per Server/server1.js)
EXPOSE 1012

# Set environment variables
ENV NODE_ENV=production
ENV PORT=1012

# Run the server
CMD ["node", "Server/server1.js"]
