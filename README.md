# Random Restaurant Picker

A full-stack web application that helps you discover restaurants by getting your current location, fetching nearby restaurants via Google Places API, filtering by cuisine type, and picking one at random for your next meal.

## Features

- **Geolocation**: Get your current location with a single click
- **Restaurant Discovery**: Find nearby restaurants within a customizable search radius (in meters)
- **Cuisine Filtering**: Filter restaurants by cuisine type
- **Random Selection**: Get a random recommendation from the filtered results
- **Secure API**: Google API key is server-side only—never exposed to the browser
- **Rate Limiting**: Built-in rate limiting to protect the backend API

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **TanStack Query (React Query)** - Server state management
- **Zod** - TypeScript-first schema validation

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **Zod** - Schema validation
- **dotenv** - Environment configuration
- **CORS** - Cross-origin request handling
- **Express Rate Limit** - Request throttling

### Testing
- **Vitest** - Unit testing (frontend and backend)
- **Supertest** - HTTP assertion library for backend routes

### APIs
- **Google Places API** - Restaurant data and geolocation

## Project Structure

This is a monorepo using npm workspaces with separated client and server folders:

```
RandomFood/
├── client/                 # Frontend (React + Vite)
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Controls.jsx
│   │   │   ├── LocationButton.jsx
│   │   │   └── RestaurantCard.jsx
│   │   ├── lib/           # Utility functions
│   │   │   ├── filter.js
│   │   │   ├── geolocation.js
│   │   │   └── randomize.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── vercel.json
│
├── server/                 # Backend (Express + Node.js)
│   ├── src/
│   │   ├── app.js         # Express app setup
│   │   ├── index.js       # Server entry point
│   │   ├── routes/
│   │   │   └── restaurants.js
│   │   ├── services/
│   │   │   └── googlePlaces.js
│   │   └── tests/
│   │       └── restaurants.test.js
│   ├── package.json
│   ├── vercel.json
│   └── .env
│
├── package.json           # Root (manages workspaces)
├── vercel.json           # Root Vercel config
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v24.x recommended for Vercel compatibility)
- A Google Maps API key with Places API enabled

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```
   This installs dependencies for both client and server workspaces.

2. **Set up backend environment:**
   - Create or update `server/.env` with your Google Maps API key:
     ```
     GOOGLE_MAPS_API_KEY=your_api_key_here
     CORS_ORIGIN=http://localhost:5173
     PORT=8787
     ```

3. **Start development servers:**
   ```bash
   npm run dev:all
   ```

4. **Open in browser:**
   - Frontend: `http://localhost:5173`
   - Backend health check: `http://localhost:8787/api/health`

## Available Scripts

All scripts are run from the root directory. The npm workspaces setup allows you to run commands across both client and server.

### Development
- `npm run dev` - Start frontend dev server (client Vite)
- `npm run dev:server` - Start backend dev server with auto-reload
- `npm run dev:all` - Start both frontend and backend concurrently

### Building
- `npm run build` - Build frontend for production
- `npm run build:all` - Build both frontend and backend
- `npm run preview` - Preview production build locally

### Quality & Testing
- `npm test` - Run all tests (client unit tests + server tests)
- `npm run lint` - Lint all code (client and server)

## API Endpoints

### GET `/api/health`
Health check endpoint. Returns `{ ok: true }` if the server is running.

### GET `/api/restaurants/nearby`
Fetch nearby restaurants.

**Query Parameters:**
- `lat` (number, required) - Latitude
- `lng` (number, required) - Longitude
- `radius` (number, optional) - Search radius in meters (default: 1000)
- `type` (string, optional) - Restaurant type filter

**Example:** `/api/restaurants/nearby?lat=40.7128&lng=-74.0060&radius=2000&type=restaurant`

## Security Features

- **API Key Protection**: Google Maps API key is stored server-side and never sent to the browser
- **Rate Limiting**: API requests are limited to 60 per minute per IP
- **CORS**: Cross-origin requests are validated against allowed origins
- **Input Validation**: All query parameters are validated with Zod

## How It Works

1. **User requests location** → Browser's Geolocation API provides coordinates
2. **App fetches nearby restaurants** → Backend queries Google Places API
3. **User filters results** → Frontend filters restaurants by cuisine type
4. **App picks a random restaurant** → Frontend uses randomization algorithm

## Development Workflow

This is a monorepo using npm workspaces:
- Root `package.json` manages shared scripts and workspace configuration
- `client/package.json` manages frontend-specific dependencies (React, Vite, Tailwind, etc.)
- `server/package.json` manages backend-specific dependencies (Express, Zod, etc.)

When you run `npm install` in the root, npm automatically installs dependencies for all workspaces.

### Running workspace-specific commands:
```bash
# Run frontend-only:
npm run dev -w client

# Run backend-only:
npm run dev -w server

# Run both:
npm run dev:all
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the ISC License.
