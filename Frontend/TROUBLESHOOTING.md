# Troubleshooting Guide

## Common Issues and Solutions

### 1. Module Import Errors (CartItem, Room, etc.)

**Error:** `The requested module '/src/types/index.ts' does not provide an export named 'CartItem'`

**Solutions:**

#### Option A: Clear Cache and Restart (Recommended)
```bash
# Stop the dev server (Ctrl+C)
# Delete the Vite cache
rm -rf node_modules/.vite
# Restart
npm run dev
```

#### Option B: Hard Refresh Browser
- Press `Ctrl + Shift + R` (Windows/Linux)
- Press `Cmd + Shift + R` (Mac)

#### Option C: Complete Clean Install
```bash
# Stop the dev server
# Delete node_modules and cache
rm -rf node_modules
rm -rf node_modules/.vite
rm -rf dist
# Reinstall
npm install
npm run dev
```

### 2. CSS/Tailwind Errors

**Error:** `The 'border-border' class does not exist`

**Solution:** This has been fixed in the codebase. If you still see it:
```bash
rm -rf node_modules/.vite
npm run dev
```

### 3. Peer Dependency Warnings

**Warning:** React version conflicts

**Solution:** The package.json has been updated to use React 18.3.1 which is compatible with all dependencies.

### 4. Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill the process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### 5. TypeScript Errors in IDE

**Issue:** Red squiggly lines but app runs fine

**Solution:**
1. Restart TypeScript server in VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
2. Close and reopen VS Code
3. Ensure all dependencies are installed

## Step-by-Step Fresh Start

If nothing works, follow these steps:

```bash
# 1. Stop all running processes
# Press Ctrl+C in terminal

# 2. Clean everything
rm -rf node_modules
rm -rf node_modules/.vite
rm -rf dist
rm -rf package-lock.json

# 3. Reinstall
npm install

# 4. Start fresh
npm run dev
```

## Verifying the Setup

Once the dev server starts, you should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open `http://localhost:5173` in your browser. You should see the hotel website homepage.

## Still Having Issues?

1. **Check Node Version**
   ```bash
   node --version
   # Should be v18 or higher
   ```

2. **Check npm Version**
   ```bash
   npm --version
   # Should be v9 or higher
   ```

3. **Check for Syntax Errors**
   - Look at the terminal for specific file and line numbers
   - Check the browser console (F12) for errors

4. **Verify File Structure**
   ```
   src/
   ├── types/
   │   └── index.ts (should exist with exports)
   ├── context/
   │   └── CartContext.tsx
   ├── data/
   │   ├── rooms.ts
   │   └── services.ts
   └── ...
   ```

## Quick Fixes Checklist

- [ ] Stopped the dev server
- [ ] Deleted `node_modules/.vite`
- [ ] Restarted dev server
- [ ] Hard refreshed browser
- [ ] Checked Node.js version (v18+)
- [ ] Verified all files exist
- [ ] No syntax errors in terminal

## Contact

If issues persist, check:
- The main README.md
- SETUP.md for detailed setup instructions
