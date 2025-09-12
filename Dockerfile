# Stage 1: Build Vue app
FROM node:16 AS build-stage
WORKDIR /app
# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
# Copy source and build
COPY . .
RUN npm run build



# Stage 2: Serve with Nginx
FROM nginx:1.23 AS production-stage
# Copy build output to Nginx html folder
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Replace default Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
