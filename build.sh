#!/bin/bash
set -e

echo "🔨 Building tlrdraw-auth project..."

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
echo "   docker build -t tlrdraw-auth-server ./prod/server"
echo "   docker build -t tlrdraw-auth-client ./prod/client"
echo ""
echo "🚀 To run:"
echo "   docker run -d --name tlrdraw-server -p 3001:3001 tlrdraw-auth-server"
echo "   docker run -d --name tlrdraw-client -p 80:80 tlrdraw-auth-client"
echo ""
echo "💾 To export images:"
echo "   docker save tlrdraw-auth-server | gzip > tlrdraw-auth-server.tar.gz"
echo "   docker save tlrdraw-auth-client | gzip > tlrdraw-auth-client.tar.gz"
echo ""
echo "📥 To import images on another machine:"
echo "   docker load < tlrdraw-auth-server.tar.gz"
echo "   docker load < tlrdraw-auth-client.tar.gz"
echo ""
echo "   Client: http://localhost:80"
echo "   Server: http://localhost:3001"

