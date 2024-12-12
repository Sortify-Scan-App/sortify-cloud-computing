# Use official Node.js image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app will run on
EXPOSE 8080

# Command to run your app
CMD ["node", "app.js"]
