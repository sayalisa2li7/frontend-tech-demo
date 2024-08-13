# Stage 1: Build
FROM node:18-slim AS build

# Set the working directory
WORKDIR /app

# Update npm to the latest version
RUN npm install -g npm@latest

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install production dependencies
COPY --from=build /app/node_modules /app/node_modules

# Copy the built Next.js application and other necessary files from the build stage
COPY --from=build /app/.next /app/.next
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/.env.local /app/.env.local

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
