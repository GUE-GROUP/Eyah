#!/bin/bash

echo "🔍 Verifying Build Configuration..."
echo ""

# Check if rolldown is in package.json
echo "1️⃣ Checking package.json..."
if grep -q "rolldown" package.json; then
    echo "   ❌ ERROR: rolldown found in package.json"
    exit 1
else
    echo "   ✅ No rolldown in package.json"
fi

# Check if vite is correct version
echo ""
echo "2️⃣ Checking Vite version..."
if grep -q '"vite": "\^6' package.json; then
    echo "   ✅ Vite 6.x found"
else
    echo "   ❌ ERROR: Vite version incorrect"
    exit 1
fi

# Check if esbuild exists
echo ""
echo "3️⃣ Checking esbuild..."
if grep -q '"esbuild"' package.json; then
    echo "   ✅ esbuild found"
else
    echo "   ❌ ERROR: esbuild missing"
    exit 1
fi

# Check if .npmrc exists
echo ""
echo "4️⃣ Checking .npmrc..."
if [ -f ".npmrc" ]; then
    echo "   ✅ .npmrc exists"
else
    echo "   ⚠️  WARNING: .npmrc missing"
fi

# Check if .vercelignore exists
echo ""
echo "5️⃣ Checking .vercelignore..."
if [ -f ".vercelignore" ]; then
    echo "   ✅ .vercelignore exists"
else
    echo "   ⚠️  WARNING: .vercelignore missing"
fi

echo ""
echo "6️⃣ Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ✅ ✅ ALL CHECKS PASSED! ✅ ✅ ✅"
    echo ""
    echo "Your configuration is correct!"
    echo "Now commit and push to deploy to Vercel."
    echo ""
    echo "Commands:"
    echo "  git add ."
    echo "  git commit -m 'Fix Vercel deployment'"
    echo "  git push"
else
    echo ""
    echo "❌ Build failed. Check errors above."
    exit 1
fi
