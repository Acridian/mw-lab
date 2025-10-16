# --- Build stage: create static site ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # -> dist/

# --- Runtime stage: serve with nginx ---
FROM nginx:alpine
# optional: replace default nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/* \
 && adduser -D -u 10001 web
COPY --from=build /app/dist /usr/share/nginx/html
# run as non-root (port 8080 instead of 80 for least-privilege)
EXPOSE 8080
USER 10001
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:8080/ || exit 1
CMD ["sh", "-c", "nginx -g 'daemon off;'"]