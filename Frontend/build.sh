#!/bin/bash

# Eyah's Hotel & Suites - Build Script
# This script builds the production-ready application

echo "🏨 Building Eyah's Hotel & Suites Frontend..."
echo "================================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Run TypeScript compiler
echo "🔨 Running TypeScript compiler..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output: ./dist"
echo ""
echo "To preview the build, run: npm run preview"
echo "================================================"
