FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Expose the ports Expo uses
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start the app
CMD ["npm", "start"] 