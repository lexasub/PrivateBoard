FROM docker.io/oven/bun:1-alpine AS builder

WORKDIR /app

# Копируем зависимости
COPY package.json bun.lock* ./

# Устанавливаем зависимости и чистим кэш
RUN bun install \
    && rm -rf /root/.bun/install/cache /root/.npm

# Копируем исходники
COPY . .

# Собираем
RUN bun run build

# Финальный образ с nginx
FROM docker.io/nginx:alpine

# Копируем собранный клиент
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Очищаем кэш и логи
RUN rm -rf /var/cache/apk/* /var/log/*

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
