# Eyah's Hotel & Suites - Build Script (PowerShell)
# This script builds the production-ready application

Write-Host "🏨 Building Eyah's Hotel & Suites Frontend..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Run TypeScript compiler and build
Write-Host "🔨 Running build process..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Build output: ./dist" -ForegroundColor Cyan
Write-Host ""
Write-Host "To preview the build, run: npm run preview" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
