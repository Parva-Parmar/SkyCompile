FROM node:20-alpine

WORKDIR /app

# Install native dependencies required for node-pty and node-gyp
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
