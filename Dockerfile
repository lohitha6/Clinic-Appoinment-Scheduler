FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g @angular/cli
EXPOSE 3000 4200
CMD ["sh", "-c", "npm run server & ng serve --host 0.0.0.0 --port 4200"]
