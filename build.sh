#!/bin/bash
set -e

echo "🔨 Building PrivateBoard project..."

# Очищаем prod директорию
rm -rf ./prod
mkdir -p ./prod/client
mkdir -p ./prod/server

# Собираем клиент
echo "📦 Building client..."
cd client
bun install
VITE_API_URL= VITE_WS_URL= bun run build
cd ..

# Копируем собранный клиент
cp -r client/dist/* prod/client/
cp client/Dockerfile prod/client/
cp client/nginx.conf prod/client/
cp client/package.json prod/client/
cp client/bun.lock prod/client/

# Копируем tldraw assets для автономной работы
if [ -d "client/public/tldraw-assets" ]; then
    echo "📦 Copying tldraw assets..."
    cp -r client/public/tldraw-assets prod/client/
fi

# Копируем сервер
echo "📦 Copying server..."
cp server/package.json server/bun.lock server/Dockerfile prod/server/
cp -r server/src prod/server/src/
cp -r server/data prod/server/ 2>/dev/null || true

# Устанавливаем зависимости сервера для Docker
echo "📦 Installing server dependencies..."
cd server
bun install
cd ..

echo ""
echo "✅ Build complete! Output in ./prod/"
echo ""
echo "📋 To build Docker images:"
echo "   docker build -t privateboard-server ./prod/server"
echo "   docker build -t privateboard-client ./prod/client"

echo ""
echo "🚀 To run:"
echo "   docker run -d --name privateboard-server -p 3001:3001 privateboard-server"
echo "   docker run -d --name privateboard-client -p 80:80 privateboard-client"

echo ""
echo "💾 To export images:"
echo "   docker save privateboard-server | gzip > privateboard-server.tar.gz"
echo "   docker save privateboard-client | gzip > privateboard-client.tar.gz"

echo ""
echo "📥 To import images on another machine:"
echo "   docker load < privateboard-server.tar.gz"
echo "   docker load < privateboard-client.tar.gz"
echo ""
echo "   Client: http://localhost:80"
echo "   Server: http://localhost:3001"

