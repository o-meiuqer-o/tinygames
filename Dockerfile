FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Hugging Face Spaces expose port 7860 by default
EXPOSE 7860
ENV PORT=7860

# Start the application
CMD ["npm", "start"]
