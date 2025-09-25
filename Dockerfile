FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g @angular/cli
EXPOSE 3000 4200
CMD ["npm", "run", "dev"]
