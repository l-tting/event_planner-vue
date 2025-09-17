# Serve static files with Nginx
FROM nginx:1.23 AS production-stage

WORKDIR /usr/share/nginx/html

# Copy everything into Nginx
COPY . .

# Replace default Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
