#!/bin/bash
set -e

echo "🔨 Building and exporting tlrdraw-auth rootfs..."

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

tar -czf tlrdraw-auth-server.tar.gz -C ./exports/server-rootfs .
tar -czf tlrdraw-auth-client.tar.gz -C ./exports/client-rootfs .

rm -rf ./exports

echo ""
echo "✅ Done!"
echo ""
echo "📦 Exported files:"
ls -lh *.tar.gz
