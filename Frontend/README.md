# Eyah's Hotel & Suites - Frontend

A modern, luxury hotel website built with React, TypeScript, Vite, TailwindCSS, and Framer Motion.

## Features

- ✨ Modern, responsive design with smooth animations
- 🎨 Beautiful UI with Tailwind CSS
- 🎭 Parallax scrolling effects
- 📱 Mobile-first responsive design
- 🛒 Shopping cart functionality
- 📅 Room booking system
- 🖼️ Image gallery with lightbox
- 🎯 SEO optimized
- ⚡ Fast performance with Vite
- 🔒 TypeScript for type safety

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── animations/      # Reusable animation components
│   ├── home/           # Home page sections
│   └── layout/         # Header, Footer
├── context/            # React Context (Cart)
├── data/              # Static data (rooms, services)
├── pages/             # Page components
├── types/             # TypeScript types
├── utils/             # Utility functions
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Pages

- **Home** - Hero section, about, services, rooms preview
- **Gallery** - Image gallery with filters
- **About** - Hotel story and values
- **Rooms** - All available rooms with filtering
- **Cart** - Shopping cart for room bookings
- **Contact** - Contact form and information
- **Book** - Multi-step booking form

## Image Placeholders

All images are currently set to placeholder paths. Replace them with actual images:

- `/images/hero-bg.jpg`
- `/images/about-hotel.jpg`
- `/images/services/*.jpg`
- `/images/rooms/*.jpg`
- `/images/gallery/*.jpg`

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  primary: '#0A3A40',
  accent: '#D4A574',
  // ...
}
```

### Content

Update content in:
- `src/data/rooms.ts` - Room information
- `src/data/services.ts` - Services information
- Page components for static content

## Security Best Practices

- Input validation on all forms
- XSS protection with React's built-in escaping
- HTTPS recommended for production
- Environment variables for sensitive data
- CORS configuration on backend

## Performance Optimizations

- Lazy loading for images
- Code splitting with React Router
- Optimized animations with Framer Motion
- Minified production build
- Tree shaking enabled

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved

## Contact

For support or inquiries, contact: info@eyahshotel.com
