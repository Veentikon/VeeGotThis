FROM node:20

WORKDIR /app

# Copy only package files first for caching
COPY VeeGotThis/package*.json ./
RUN npm install

# Copy the rest of your source
COPY VeeGotThis .

# Expose Vite port
EXPOSE 5173

CMD ["npm", "run", "dev"]
