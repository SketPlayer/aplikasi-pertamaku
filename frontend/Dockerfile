FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install pnpm -g && pnpm install

COPY . .

# Build the application
ARG VITE_SUBDOMAIN
RUN VITE_SUBDOMAIN=${VITE_SUBDOMAIN} pnpm run build

# Use a lightweight web server for static content
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
