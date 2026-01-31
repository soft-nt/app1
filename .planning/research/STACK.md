# Stack Research

**Domain:** Weather widget integration for existing React app
**Researched:** 2026-01-31
**Confidence:** HIGH

## Recommended Stack Additions

### API Integration

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Native Fetch API | Built-in | HTTP requests to OpenWeatherMap | Zero dependencies, promise-based, universally supported in modern browsers, perfectly adequate for simple GET requests |
| TypeScript Interfaces | Built-in | Type safety for API responses | Manual interface definition keeps zero-dependency philosophy, provides full type safety without package overhead |

### Environment Configuration

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vite Environment Variables | Built-in (Vite 7.3.1) | Secure API key management | Already in stack, uses VITE_ prefix convention, prevents accidental client exposure of secrets |
| .env.local | Standard | Local API key storage | Git-ignored by default, standard practice, works seamlessly with Vite |

### Weather Icons

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| OpenWeatherMap CDN Icons | Free tier | Display weather conditions | Provided by API response (icon codes), no additional library needed, consistent with API data |

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| axios | Overkill for simple GET requests, adds 13KB+ dependency | Native fetch API (built-in, promise-based, adequate for this use case) |
| openweathermap-ts | Full client library (last updated 2021), unnecessary abstraction | Manual fetch + TypeScript interfaces (more control, zero deps) |
| @curium.rocks/openweathermap-client | Heavy dependency for simple current weather call | Native fetch with typed response |
| Weather icon libraries | Additional bundle size for what API provides | Use OpenWeatherMap's built-in icon URLs from response |
| dotenv package | Vite handles .env files natively | Vite's built-in environment variable support |

## Implementation Details

### TypeScript Types

Create manual interfaces for type safety:

```typescript
// src/types/weather.ts
export interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
  cod: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  city: string;
}
```

**Why manual types:**
- No @types packages exist for OpenWeatherMap
- Response structure is simple and stable
- Full control over what fields are included
- Zero dependency approach

### API Key Configuration

```bash
# .env.local (git-ignored)
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

**Access in code:**
```typescript
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
```

**Why VITE_ prefix:**
- Required by Vite to expose to client code
- Prevents accidental exposure of server secrets
- Type-safe with Vite's import.meta.env

### Fetch Implementation Pattern

```typescript
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=Geneva&units=metric&appid=${apiKey}`
);

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data: WeatherResponse = await response.json();
```

**Why this pattern:**
- Native fetch is promise-based, works with async/await
- No dependencies needed
- Built-in to all modern browsers (Chrome 42+, Firefox 39+, Safari 10.1+, Edge 14+)
- Error handling via response.ok check

### Weather Icon URLs

OpenWeatherMap provides icons via CDN:

```typescript
const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
```

**Icon codes provided in API response:**
- `weather[0].icon` field (e.g., "01d", "10n", "09d")
- @2x.png for higher resolution (100x100px)
- Covers all weather conditions (clear, clouds, rain, snow, etc.)

## API Specifications

### OpenWeatherMap Current Weather API

**Endpoint:** `https://api.openweathermap.org/data/2.5/weather`

**Required Parameters:**
- `q`: City name (e.g., "Geneva")
- `appid`: API key from account
- `units`: "metric" for Celsius

**Free Tier Limits:**
- 60 calls/minute
- 1,000,000 calls/month
- More than adequate for "fetch on page load only" requirement

**Response Format:** JSON with weather conditions, temperature, icon codes

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Native fetch | axios | If you need request/response interceptors, automatic retries, or complex request transformations (not needed here) |
| Manual TypeScript types | openweathermap-ts | If you need multiple API endpoints (forecast, historical, etc.) and want type coverage for all |
| VITE_ env variables | Runtime config | If API key needs to change without rebuild (not needed for this simple app) |
| OpenWeatherMap icons | react-icons weather set | If you want custom icon styling or offline support (not needed, API icons are sufficient) |

## Integration with Existing Stack

**No conflicts:**
- Fetch API works seamlessly with React 19 hooks (useState, useEffect)
- TypeScript 5.9.3 handles interface definitions natively
- Vite 7.3.1 has built-in .env support
- ESLint 9 compatible (no fetch-related lint rules needed)

**Patterns to follow:**
- Keep zero external dependencies for core functionality
- Use React hooks for state management (useState for weather data)
- Use useEffect for fetch on component mount
- Handle loading and error states with useState

## Installation

```bash
# NO PACKAGES TO INSTALL
# Everything needed is already in the stack or built into the browser

# Just create the .env.local file:
echo "VITE_OPENWEATHER_API_KEY=your_api_key_here" > .env.local
```

**Setup steps:**
1. Sign up for free OpenWeatherMap API key at https://openweathermap.org/api
2. Create `.env.local` with `VITE_OPENWEATHER_API_KEY=<your_key>`
3. Restart dev server to load environment variables
4. Create `src/types/weather.ts` with response interfaces
5. Implement fetch in weather component

## Sources

- https://vite.dev/guide/env-and-mode.html — Vite environment variable configuration (HIGH confidence)
- https://openweathermap.org/current — OpenWeatherMap Current Weather API documentation (HIGH confidence)
- https://openweathermap.org/weather-conditions — Weather condition codes and icons (MEDIUM confidence)
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch — Fetch API usage and browser support (HIGH confidence)
- npm search for TypeScript packages — Evaluated openweathermap-ts (2021), @curium.rocks/openweathermap-client (2024) — determined unnecessary (HIGH confidence)

---
*Stack research for: Weather widget integration (v1.2 milestone)*
*Researched: 2026-01-31*
*Philosophy: Zero external dependencies, use platform capabilities*
