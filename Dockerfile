FROM node:18-alpine

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Verify files are copied
RUN ls -la /app/src/

# Expose ports
EXPOSE 3000 4200

# Start both services
CMD ["npm", "run", "dev"]