FROM docker.io/oven/bun:1-alpine AS builder

WORKDIR /app

# Копируем зависимости
COPY package.json bun.lock* ./

# Устанавливаем зависимости и чистим кэш
RUN bun install \
    && rm -rf /root/.bun/install/cache /root/.npm

# Копируем исходники (включая public/tldraw-assets)
COPY . .

# Собираем
RUN bun run build

# Финальный образ с nginx
FROM docker.io/nginx:alpine

# Копируем dist из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем tldraw assets из builder (где они в public/tldraw-assets)
COPY --from=builder /app/public/tldraw-assets /usr/share/nginx/html/tldraw-assets

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Очищаем кэш и логи
RUN rm -rf /var/cache/apk/* /var/log/*

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
