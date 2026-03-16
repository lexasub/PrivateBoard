#!/bin/bash

set -e

SERVER_TAR="privateboard-server.tar.gz"
CLIENT_TAR="privateboard-client.tar.gz"

docker network create tlrdraw-net 2>/dev/null || true

echo "=== Импорт образов ==="

if [ -f "$SERVER_TAR" ]; then
    echo "Импорт сервера из $SERVER_TAR..."
    docker import "$SERVER_TAR" privateboard-server:latest
else
    echo "Ошибка: $SERVER_TAR не найден"
    exit 1
fi

if [ -f "$CLIENT_TAR" ]; then
    echo "Импорт клиента из $CLIENT_TAR..."
    docker import "$CLIENT_TAR" privateboard-client:latest
else
    echo "Ошибка: $CLIENT_TAR не найден"
    exit 1
fi

echo ""
echo "=== Запуск контейнеров ==="

docker rm -f tlrdraw-server tlrdraw-client 2>/dev/null || true

docker run -d \
    --name tlrdraw-server \
    --network tlrdraw-net \
    -p 9999:3001 \
    -v tlrdraw_data:/app/data \
    -e JWT_SECRET=dev-secret-key \
    --workdir /app \
    privateboard-server:latest \
    /usr/local/bin/bun run start

docker run -d \
    --name tlrdraw-client \
    --network tlrdraw-net \
    -p 8080:80 \
    privateboard-client:latest \
    sh -c "mkdir -p /var/log/nginx && exec nginx -g 'daemon off;'"

echo ""
echo "=== Контейнеры ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
