FROM node:20-alpine

WORKDIR /app

# Install curl for health checks and dependencies
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Expose Vite dev server strictly to 0.0.0.0 so host can access it
CMD ["npm", "run", "dev", "--", "--host"]
