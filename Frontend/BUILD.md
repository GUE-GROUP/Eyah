# Build Guide - Eyah's Hotel & Suites

## Quick Build

### Windows (PowerShell)
```powershell
.\build.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x build.sh
./build.sh
```

### Using npm directly
```bash
npm run build
```

## Build Process

The build script performs the following steps:

1. **Checks Dependencies** - Ensures all npm packages are installed
2. **Cleans Previous Build** - Removes old `dist` folder
3. **TypeScript Compilation** - Compiles TypeScript to JavaScript
4. **Vite Build** - Bundles and optimizes the application
5. **Output** - Creates production files in `./dist`

## Build Output

After a successful build, you'll find:

```
dist/
├── assets/
│   ├── index-[hash].js      # Bundled JavaScript
│   ├── index-[hash].css     # Bundled CSS
│   └── [images]             # Optimized images
├── images/                  # Public images
└── index.html              # Entry HTML file
```

## Preview Build

To test the production build locally:

```bash
npm run preview
```

This starts a local server at `http://localhost:4173`

## Build for Different Environments

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Production Build with Analysis
```bash
npm run build -- --mode production
```

## Optimization Features

The build process includes:

- ✅ **Code Minification** - JavaScript and CSS are minified
- ✅ **Tree Shaking** - Unused code is removed
- ✅ **Code Splitting** - Lazy loading for better performance
- ✅ **Asset Optimization** - Images and fonts are optimized
- ✅ **Source Maps** - For debugging (can be disabled)
- ✅ **Gzip Compression** - Smaller file sizes

## Build Configuration

Build settings are in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to true for debugging
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion'],
        },
      },
    },
  },
})
```

## Deployment

After building, deploy the `dist` folder to:

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Traditional Hosting
Upload the contents of the `dist` folder to your web server's public directory.

## Troubleshooting

### Build Fails

**Error: Out of memory**
```bash
# Increase Node.js memory
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

**Error: TypeScript errors**
```bash
# Check for type errors
npm run lint
```

**Error: Missing dependencies**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Build is Slow

1. Disable source maps in production
2. Use `esbuild` instead of `terser` for minification
3. Reduce bundle size by code splitting

### Large Bundle Size

1. Check bundle analysis:
```bash
npm run build -- --mode production
```

2. Lazy load heavy components
3. Optimize images before adding to project
4. Remove unused dependencies

## Build Size Targets

Aim for these sizes:

- **JavaScript**: < 500KB (gzipped)
- **CSS**: < 100KB (gzipped)
- **Images**: Optimized and lazy-loaded
- **Total Initial Load**: < 1MB

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/
```

## Performance Checklist

After building, verify:

- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Routing works
- [ ] Forms submit correctly
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Fast load times (< 3s)

## Support

For build issues:
- Check the main README.md
- Review TROUBLESHOOTING.md
- Contact: info@eyahshotel.com
