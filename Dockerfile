# Use a lightweight Node.js 20 image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Move source files and assets
COPY Server ./Server
COPY public ./public

# SECURITY: Set permissions and switch to non-root 'node' user
RUN chown -R node:node /app
USER node

# Expose the application port
EXPOSE 1012

# Environment configuration
ENV NODE_ENV=production
ENV PORT=1012

# Start the application
CMD ["node", "Server/server1.js"]
