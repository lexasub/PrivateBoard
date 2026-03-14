FROM docker.io/oven/bun:1-alpine

WORKDIR /app

# Копируем зависимости
COPY package.json bun.lock* ./

# Устанавливаем зависимости и чистим кэш
RUN bun install \
    && rm -rf /root/.bun/install/cache /root/.npm /var/cache/apk/* /var/log/*

# Копируем код сервера
COPY src/ ./src/

# Создаем директорию для данных
RUN mkdir -p /app/data

# Экспозиция порта
EXPOSE 3001

# Запуск сервера
CMD ["bun", "run", "src/index.js"]
