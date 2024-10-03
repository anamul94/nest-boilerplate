# Use Node 20 alpine as parent image
FROM node:20-alpine AS builder

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy the rest of project files into this image
COPY . .

# Ensure .env file is copied (if it exists)
COPY .env .env

# Build the Nest.js application
RUN npm run build

# Create a new stage for the final image
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Copy .env file from builder stage
COPY --from=builder /app/.env ./.env

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]
