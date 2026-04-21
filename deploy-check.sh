#!/bin/bash

# 🚀 Daily Tracker Deployment Script (Render-only)
#
# HƯỚNG DẪN SỬ DỤNG:
# 1. Chạy script này để kiểm tra code trước khi deploy
# 2. Làm theo các bước manual trong DEPLOY.md
#
# Usage: ./deploy-check.sh

echo "=========================================="
echo "🚀 Daily Tracker - Deployment Checklist"
echo "=========================================="
echo ""

# Kiểm tra Node.js version
echo "📦 Kiểm tra Node.js..."
node_version=$(node --version)
echo "   Node.js version: $node_version"

# Kiểm tra Git
echo "📂 Kiểm tra Git..."
if [ -d .git ]; then
    echo "   ✅ Git repository đã tồn tại"
    branch=$(git branch --show-current)
    echo "   📌 Branch hiện tại: $branch"
else
    echo "   ❌ Không tìm thấy Git repository"
    exit 1
fi

# Kiểm tra file cấu hình
echo ""
echo "🔧 Kiểm tra file cấu hình..."

files_to_check=(
    "client/vercel.json"
    "server/.env.production"
    "DEPLOY.md"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (thiếu)"
    fi
done

# Kiểm tra server dependencies
echo ""
echo "📦 Kiểm tra Server dependencies..."
cd server
if [ -d "node_modules" ]; then
    echo "   ✅ Server node_modules tồn tại"
else
    echo "   ⚠️  Thiếu node_modules, chạy: cd server && npm install"
fi
cd ..

# Kiểm tra client dependencies
echo ""
echo "📦 Kiểm tra Client dependencies..."
cd client
if [ -d "node_modules" ]; then
    echo "   ✅ Client node_modules tồn tại"
else
    echo "   ⚠️  Thiếu node_modules, chạy: cd client && npm install"
fi
cd ..

# Kiểm tra .env files (đảm bảo không commit)
echo ""
echo "🔒 Kiểm tra Environment Files..."
if [ -f ".env" ]; then
    echo "   ⚠️  .env tồn tại ở root (không nên commit)"
fi
if [ -f "server/.env" ]; then
    echo "   ⚠️  server/.env tồn tại (không nên commit)"
fi
if [ -f "client/.env" ]; then
    echo "   ⚠️  client/.env tồn tại (không nên commit)"
fi

# Kiểm tra client build
echo ""
echo "🔨 Kiểm tra Client Build..."
cd client
if npm run lint > /dev/null 2>&1; then
    echo "   ✅ ESLint pass"
else
    echo "   ❌ ESLint có lỗi, chạy: cd client && npm run lint"
fi
if npm run build > /dev/null 2>&1; then
    echo "   ✅ Build thành công"
else
    echo "   ❌ Build thất bại, chạy: cd client && npm run build"
fi
cd ..

# Kiểm tra git status
echo ""
echo "📊 Git Status..."
git status --short

echo ""
echo "=========================================="
echo "✅ Kiểm tra hoàn tất!"
echo ""
echo "📋 Bước tiếp theo:"
echo "   1. Đảm bảo code đã push lên GitHub"
echo "   2. Deploy frontend lên Render (Static Site)"
echo "   3. Làm theo hướng dẫn trong DEPLOY.md"
echo ""
echo "💰 Chi phí: 0 USD/tháng (Free tier)"
echo "=========================================="
