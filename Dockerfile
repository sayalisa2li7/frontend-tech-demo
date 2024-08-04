# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Update npm
RUN npm install -g npm@latest

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the .env.local file
COPY .env.local .env.local

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]