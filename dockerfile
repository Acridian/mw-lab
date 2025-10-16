# --- Build stage: create static site ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # -> dist/

# --- Runtime stage: serve with nginx ---
FROM nginx:alpine
# create non-root user
RUN adduser -D -u 10001 web

# copy config *before* permissions if you want to set pid/temp paths there
COPY nginx.conf /etc/nginx/nginx.conf

# prepare and own all dirs nginx writes to
RUN mkdir -p /var/cache/nginx /var/run/nginx /var/log/nginx \
 && chown -R web:web /var/cache/nginx /var/run/nginx /var/log/nginx /usr/share/nginx/html

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
USER 10001
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ || exit 1
CMD ["sh", "-c", "nginx -g 'daemon off;'"]