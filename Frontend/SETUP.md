# Setup Guide - Eyah's Hotel & Suites Frontend

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5173`

## Troubleshooting

### Module Import Errors

If you see errors like "does not provide an export named", try:

1. Stop the dev server (Ctrl+C)
2. Clear the cache:
   ```bash
   rm -rf node_modules/.vite
   ```
3. Restart the dev server:
   ```bash
   npm run dev
   ```

### Dependency Conflicts

If you encounter peer dependency issues during installation:

```bash
npm install --legacy-peer-deps
```

### TypeScript Errors

If you see TypeScript errors in your IDE but the app runs fine:
- Restart your IDE/TypeScript server
- Check that all dependencies are installed
- Ensure you're using Node.js v18 or higher

## Adding Images

Replace placeholder image paths with your actual images:

1. Create the following directories in `public/`:
   ```
   public/
   ├── images/
   │   ├── hero-bg.jpg
   │   ├── about-hotel.jpg
   │   ├── about-story.jpg
   │   ├── cta-bg.jpg
   │   ├── services/
   │   │   ├── gym.jpg
   │   │   ├── event-hall.jpg
   │   │   ├── restaurant.jpg
   │   │   └── accommodation.jpg
   │   ├── rooms/
   │   │   ├── comfy-deluxe.jpg
   │   │   ├── super-deluxe.jpg
   │   │   ├── luxury-splash.jpg
   │   │   ├── avalanche-suite.jpg
   │   │   ├── business-executive.jpg
   │   │   └── presidential-suite.jpg
   │   └── gallery/
   │       ├── room-1.jpg to room-5.jpg
   │       ├── facility-1.jpg to facility-4.jpg
   │       └── dining-1.jpg to dining-3.jpg
   ```

2. All images should be optimized for web (compressed, proper dimensions)
3. Recommended dimensions:
   - Hero images: 1920x1080px
   - Room images: 800x600px
   - Gallery images: 600x600px
   - Service images: 800x600px

## Customization

### Update Hotel Information

1. **Contact Details** - Edit `src/components/layout/Footer.tsx`
2. **Room Information** - Edit `src/data/rooms.ts`
3. **Services** - Edit `src/data/services.ts`
4. **Colors** - Edit `tailwind.config.js`

### Modify Content

All page content can be edited directly in the respective page components:
- `src/pages/Home.tsx`
- `src/pages/About.tsx`
- `src/pages/Contact.tsx`
- etc.

## Building for Production

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy**
   - The `dist/` folder contains your production-ready files
   - Upload to your hosting provider (Netlify, Vercel, etc.)

## Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
VITE_API_URL=your_backend_api_url
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

## Performance Tips

1. **Optimize Images**
   - Use WebP format where possible
   - Compress images before uploading
   - Use appropriate dimensions

2. **Lazy Loading**
   - Images are already set to lazy load
   - Consider code splitting for large components

3. **Caching**
   - Configure your hosting provider for proper caching headers
   - Use CDN for static assets

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Support

For issues or questions:
- Check the main README.md
- Review the code comments
- Contact: info@eyahshotel.com

## Development Notes

- Hot Module Replacement (HMR) is enabled
- TypeScript strict mode is enabled
- ESLint is configured for code quality
- Tailwind CSS for styling
- Framer Motion for animations
