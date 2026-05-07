# Album Viewer

A modern Vue.js 3 application built with TypeScript that displays albums from the albums API.

## Features

- 🎵 Display album collection in a beautiful grid layout
- 🎨 Modern, responsive design with gradient background
- 🖼️ Album cover images with hover effects
- 💰 Price display for each album
- 🛒 Cart badge and cart details panel with add/remove support
- 📱 Mobile-friendly responsive design
- ⚡ Built with Vue 3, TypeScript, and Vite
- 🔧 Full TypeScript support with type safety
- 📝 Modern Composition API with `<script setup>`

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript knowledge (helpful but not required)
- The albums-api should be running on `http://localhost:3000`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3001`

## API Integration

The app fetches album data from the albums API endpoint `/albums`. Make sure the albums-api is running before starting the Vue app.

The API should return albums in the following format:
```json
[
  {
    "id": 1,
    "title": "Album Title",
    "artist": "Artist Name",
    "price": 10.99,
    "image_url": "https://example.com/image.jpg"
  }
]
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (with TypeScript compilation)
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking without building
- `npm test` - Run Vitest unit/component tests
- `npm run test:e2e` - Run Playwright end-to-end tests

## Project Structure

```
album-viewer/
├── src/
│   ├── components/
│   │   └── AlbumCard.vue    # Individual album card component (TypeScript)
│   ├── types/
│   │   └── album.ts         # TypeScript type definitions
│   ├── App.vue              # Main app component (TypeScript)
│   └── main.ts              # App entry point (TypeScript)
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration (TypeScript)
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # App-specific TypeScript config
├── env.d.ts                 # Environment type declarations
└── package.json             # Dependencies and scripts
```

## Technologies Used

- Vue 3 (Composition API with `<script setup>`)
- TypeScript (Static type checking and better developer experience)
- Vite (Build tool with TypeScript support)
- Axios (HTTP client with TypeScript generics)
- CSS3 (Grid, Flexbox, Animations)

## TypeScript Features

This application leverages TypeScript for enhanced development experience:

- **Type Safety**: All components, functions, and data structures are strongly typed
- **Interface Definitions**: Clear contracts for data structures (Album interface)
- **Better IDE Support**: Enhanced IntelliSense, auto-completion, and error detection
- **Compile-time Error Checking**: Catch errors before runtime
- **Modern Vue 3 Syntax**: Uses `<script setup lang="ts">` for optimal TypeScript integration

## Features in Detail

### Album Cards
Each album is displayed in a card with:
- Album cover image
- Title and artist information
- Price display
- Hover effects with play button overlay
- Add to Cart and Preview buttons

### Responsive Design
The app adapts to different screen sizes:
- Desktop: Multi-column grid layout
- Mobile: Single column layout with stacked buttons

### Error Handling
- Loading spinner while fetching data
- Error message with retry button if API is unavailable
- Fallback placeholder image for broken album covers
