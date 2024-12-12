FROM node:18
# Set the working directory inside the container
WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy the entire project into the working directory
COPY . .
# Set environment variables
ENV APP_ENV=production
ENV APP_PORT=8080
ENV PROJECT_ID=""
# Start the application
CMD [ "npm", "start" ]
EXPOSE 8080