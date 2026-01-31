# Date Display App

A React web application that displays the current date with an interactive color-changing button, plus a configurable weather widget showing real-time temperature and conditions for user-selected cities.

Built to demonstrate the GSD workflow from initialization through multi-milestone execution on a simple, focused project with clean architecture.

## Features

- **Dynamic Date Display**: Current date displayed using native `Intl.DateTimeFormat` (zero dependencies)
- **Interactive Color Button**: Click to randomly change the date text color
- **Real-Time Weather Widget**: Live temperature and weather conditions from Open-Meteo API
- **City Configuration**: Choose from 25 preset cities with searchable dropdown
- **Location Visualization**: Interactive OpenStreetMap embed showing selected city
- **Persistent Settings**: City selection saved to localStorage with graceful error handling
- **Responsive Layout**: Clean flexbox-based header with date and weather side-by-side
- **Accessible UI**: Native dialog element for settings modal with built-in focus management

## Tech Stack

- **React** 19.2.3 with TypeScript 5.9.3
- **Vite** 7.3.1 for build tooling and dev server
- **ESLint** 9 with typescript-eslint
- **react-icons** 5.5.0 for weather condition icons
- **Open-Meteo API** for weather data (no API key required)
- **OpenStreetMap** for city location maps (no API key required)

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn package manager

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Production Build

Build the app for production:

```bash
npm run build
```

The optimized production files will be in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

## Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx           # Main header with date and weather
│   ├── DateDisplay.tsx      # Date component with dynamic color
│   ├── WeatherWidget.tsx    # Weather display with API integration
│   ├── Button.tsx           # Interactive color-changing button
│   ├── SettingsModal.tsx    # Native dialog modal for settings
│   ├── CitySelector.tsx     # Searchable city dropdown
│   └── CityMap.tsx          # OpenStreetMap location embed
├── types/
│   ├── weather.ts           # TypeScript types for Open-Meteo API
│   └── city.ts              # City type with coordinates
├── data/
│   └── cities.ts            # 25 preset cities with lat/lon
├── utils/
│   └── storage.ts           # localStorage wrapper with error handling
├── App.tsx                  # Main application with state management
└── main.tsx                 # React entry point
```

## Version History

- **v1.4** (2026-01-31): City configuration with settings modal, city selector, map integration, and localStorage persistence
- **v1.3** (2026-01-31): Skipped in roadmap
- **v1.2** (2026-01-31): Weather widget with Open-Meteo API integration, loading/error states, and header layout
- **v1.1** (2026-01-31): Interactive button with random color generation
- **v1.0** (2026-01-31): Initial MVP with React + Vite setup and date display

## License

This is an experimental project built for demonstrating the GSD workflow.
