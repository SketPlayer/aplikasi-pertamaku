FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

# Build the frontend
RUN pnpm run build

# Use an Nginx base image to serve the frontend
FROM nginx:alpine

# Copy the built frontend files to Nginx's default directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80