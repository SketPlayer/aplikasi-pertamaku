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

# Copy SSL certificates
COPY ./certs/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY ./certs/privkey.pem /etc/ssl/private/privkey.pem

# Copy the Nginx template configuration file
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Use envsubst to create the final Nginx configuration based on the environment variable
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

EXPOSE 80
EXPOSE 443