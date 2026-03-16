#!/bin/bash
set -e

echo "🔨 Building and exporting PrivateBoard rootfs..."

./build.sh

echo ""
echo "📦 Building rootfs..."

mkdir -p ./exports/server-rootfs ./exports/client-rootfs

echo "Building server..."
docker build --output ./exports/server-rootfs ./prod/server

echo "Building client..."
docker build --output ./exports/client-rootfs ./prod/client

echo ""
echo "📦 Архивирование..."

tar -czf privateboard-server.tar.gz -C ./exports/server-rootfs .
tar -czf privateboard-client.tar.gz -C ./exports/client-rootfs .

rm -rf ./exports

echo ""
echo "✅ Done!"
echo ""
echo "📦 Exported files:"
ls -lh *.tar.gz
