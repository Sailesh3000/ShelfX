FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy backend files
COPY backend/ ./backend/

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "backend/db.js"]