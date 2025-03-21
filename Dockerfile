# Use official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies using npm ci (clean install)
RUN npm ci --only=production

# Copy only necessary files (Avoid copying node_modules)
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose the port your app runs on
EXPOSE 3000

# Start the application using npm start
CMD ["npm", "start"]
