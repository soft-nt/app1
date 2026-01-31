# Phase 5: Project Setup & Environment - Research

**Researched:** 2026-01-31
**Domain:** Vite environment variables, OpenWeatherMap API integration, TypeScript type safety
**Confidence:** HIGH

## Summary

This phase requires setting up environment variables for OpenWeatherMap API integration in a Vite + TypeScript project. The standard approach uses Vite's built-in environment variable system with `.env.local` files and the `VITE_` prefix for client-exposed variables. TypeScript interfaces should be manually defined for the OpenWeatherMap API response structure since no official type definitions exist in DefinitelyTyped.

The project already has proper TypeScript configuration and gitignore setup. The key work involves creating the `.env.local` file with proper variable naming, defining TypeScript interfaces that match the OpenWeatherMap Current Weather API response structure, and ensuring type safety throughout the application with proper import.meta.env typing.

**Primary recommendation:** Use `.env.local` with `VITE_OPENWEATHER_API_KEY` variable name, define TypeScript interfaces in `src/types/weather.ts`, and extend Vite's ImportMetaEnv interface for type-safe environment variable access.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vite | 7.2.4 (current) | Build tool with built-in env var support | Official build tool, zero config needed |
| TypeScript | 5.9.3 (current) | Type safety | Already in project, standard for React |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| N/A | - | No additional libraries needed | Vite handles env vars natively |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Built-in Vite env | dotenv package | Unnecessary - Vite already handles .env files |
| Manual types | @types/openweathermap | Package doesn't exist in DefinitelyTyped |
| Multiple .env files | Single .env.local | .env.local is standard for local secrets |

**Installation:**
```bash
# No additional packages needed
# Vite already includes environment variable support
```

## Architecture Patterns

### Recommended Project Structure
```
project-root/
├── .env.local              # Local environment variables (git-ignored)
├── .gitignore              # Already contains *.local
├── src/
│   ├── types/
│   │   └── weather.ts      # TypeScript interfaces for API
│   ├── services/
│   │   └── weather.ts      # API fetching logic (future phase)
│   └── vite-env.d.ts       # Extend ImportMetaEnv interface
```

### Pattern 1: Environment Variable Declaration
**What:** Create `.env.local` file in project root with VITE_ prefixed variables
**When to use:** For all client-side environment variables in Vite projects
**Example:**
```bash
# .env.local
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

**Access in code:**
```typescript
// Source: https://vite.dev/guide/env-and-mode.html
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
```

### Pattern 2: TypeScript Environment Variable Typing
**What:** Extend Vite's ImportMetaEnv interface for type safety
**When to use:** Always, for autocomplete and type checking
**Example:**
```typescript
// Source: Vite TypeScript best practices
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### Pattern 3: OpenWeatherMap API Response Typing
**What:** Define TypeScript interfaces matching the API response structure
**When to use:** For all external API integrations
**Example:**
```typescript
// Source: https://openweathermap.org/current
// src/types/weather.ts

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface MainWeatherData {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
}

export interface Wind {
  speed: number
  deg: number
  gust?: number
}

export interface Clouds {
  all: number
}

export interface Sys {
  type?: number
  id?: number
  country: string
  sunrise: number
  sunset: number
}

export interface Coord {
  lon: number
  lat: number
}

export interface WeatherData {
  coord: Coord
  weather: WeatherCondition[]
  base: string
  main: MainWeatherData
  visibility: number
  wind: Wind
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}
```

### Anti-Patterns to Avoid
- **Omitting VITE_ prefix:** Variables without this prefix are NOT exposed to client code and will be undefined
- **Committing .env.local:** This file contains secrets and should remain git-ignored (already handled by *.local in .gitignore)
- **Using any or unknown for API types:** Defeats the purpose of TypeScript, always define specific interfaces
- **Hardcoding API keys:** Never put API keys directly in source code, always use environment variables

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Environment variable loading | Custom file reader | Vite's built-in system | Handles mode-specific files, priority, and .local variants automatically |
| Environment variable typing | Runtime validation | ImportMetaEnv interface extension | Compile-time type checking, autocomplete in IDE |
| API response validation | Manual checks | TypeScript interfaces + type assertion | Type safety throughout application, catches errors at compile time |

**Key insight:** Vite already solves environment variable management. Adding dotenv or custom loaders adds unnecessary complexity and bypasses Vite's security model (VITE_ prefix requirement).

## Common Pitfalls

### Pitfall 1: Missing VITE_ Prefix
**What goes wrong:** Environment variable is undefined in client code even though it's in .env.local
**Why it happens:** Vite only exposes variables prefixed with VITE_ to prevent accidental exposure of secrets
**How to avoid:** Always prefix client-side variables with VITE_ (e.g., `VITE_OPENWEATHER_API_KEY`)
**Warning signs:** `import.meta.env.OPENWEATHER_API_KEY` returns undefined, but file exists

### Pitfall 2: Not Restarting Dev Server
**What goes wrong:** New environment variables or changes don't appear in running application
**Why it happens:** Vite loads .env files at startup, not during hot reload
**How to avoid:** Restart `npm run dev` after creating or modifying .env files
**Warning signs:** Variable works for others but not you, or stopped working after edit

### Pitfall 3: Incorrect .env File Location
**What goes wrong:** Variables not loaded despite correct naming
**Why it happens:** .env files must be in project root (where package.json is), not in src/
**How to avoid:** Create .env.local at project root: `/project/.env.local` not `/project/src/.env.local`
**Warning signs:** All environment variables undefined

### Pitfall 4: Optional Fields Not Marked in TypeScript
**What goes wrong:** Runtime errors when accessing fields that aren't always present in API response
**Why it happens:** OpenWeatherMap API returns different fields based on conditions (e.g., gust only present sometimes)
**How to avoid:** Mark optional fields with `?` in interface (e.g., `gust?: number`)
**Warning signs:** TypeError: Cannot read property of undefined in production

### Pitfall 5: Exposing Secrets in Client Bundle
**What goes wrong:** API keys visible in browser developer tools / source
**Why it happens:** All VITE_ variables are bundled into client JavaScript
**Security note:** This is expected behavior for client-side APIs. OpenWeatherMap expects the API key to be used client-side and uses domain restrictions + rate limiting for security. However, NEVER use VITE_ prefix for server-side secrets (database passwords, private keys, etc.)
**How to avoid:** Only use VITE_ prefix for API keys intended for client-side use. For server secrets, use server-side environment variables without VITE_ prefix
**Warning signs:** Variable appears in browser source maps or network requests

## Code Examples

Verified patterns from official sources:

### Creating .env.local File
```bash
# Source: https://vite.dev/guide/env-and-mode.html
# .env.local (in project root, git-ignored by *.local)

# OpenWeatherMap API key
VITE_OPENWEATHER_API_KEY=abc123def456
```

### Accessing Environment Variables with Type Safety
```typescript
// Source: Vite official documentation + TypeScript best practices

// 1. Extend ImportMetaEnv in src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 2. Access with full type safety
const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
// TypeScript knows this is a string, provides autocomplete
```

### TypeScript Interface for Weather API
```typescript
// Source: https://openweathermap.org/current
// src/types/weather.ts

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface MainWeatherData {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
}

export interface WeatherData {
  coord: {
    lon: number
    lat: number
  }
  weather: WeatherCondition[]
  main: MainWeatherData
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number  // Optional field
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}
```

### Using Types with API Response
```typescript
// Future usage pattern
import type { WeatherData } from './types/weather'

async function fetchWeather(city: string): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
  const data: WeatherData = await response.json()
  return data
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| dotenv package | Vite built-in env vars | Vite 2.0 (2021) | No dependencies needed, security by default |
| .env for all environments | .env.local for secrets | Standard since ~2019 | Clearer separation of committed vs local config |
| process.env.VAR | import.meta.env.VAR | Vite/ES modules | Works in browser, tree-shakeable |
| One Call API 2.5 | One Call API 3.0 | 2023 | New subscription required, but Current Weather API (2.5) still active |

**Deprecated/outdated:**
- **dotenv package for Vite projects**: Vite handles .env files natively, adding dotenv creates conflicts
- **Using process.env in Vite**: Node.js API, not available in browser. Use import.meta.env instead
- **Env variables without typing**: TypeScript best practice now includes extending ImportMetaEnv

## Open Questions

Things that couldn't be fully resolved:

1. **OpenWeatherMap API version choice**
   - What we know: Current Weather API (2.5) is free and active. One Call API 3.0 is newer but requires subscription
   - What's unclear: Which API endpoint to use for this project
   - Recommendation: Use Current Weather API (2.5) - matches free tier, simpler response structure, sufficient for MVP

2. **Environment variable validation**
   - What we know: TypeScript provides compile-time typing, but runtime validation not included
   - What's unclear: Whether to add runtime validation for missing API key
   - Recommendation: Add simple runtime check in initial fetch, throw helpful error if undefined. No library needed - simple if statement

3. **Type definitions source of truth**
   - What we know: No official TypeScript types exist for OpenWeatherMap
   - What's unclear: Best way to keep types in sync with API
   - Recommendation: Define manually based on official docs, add JSDoc comments linking to API documentation for reference

## Sources

### Primary (HIGH confidence)
- Vite environment variables: https://vite.dev/guide/env-and-mode.html (official documentation)
- OpenWeatherMap Current Weather API: https://openweathermap.org/current (official API docs)
- OpenWeatherMap One Call API 3.0: https://openweathermap.org/api/one-call-3 (official API docs)
- Project codebase: Existing tsconfig.json, .gitignore, package.json

### Secondary (MEDIUM confidence)
- TypeScript interface patterns: Standard TypeScript practices (object types, optional properties, nested interfaces)
- Project structure patterns: Common React + TypeScript conventions

### Tertiary (LOW confidence)
- None - all recommendations based on official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Based on current project setup and official Vite documentation
- Architecture: HIGH - Official Vite patterns and OpenWeatherMap API structure from official docs
- Pitfalls: HIGH - Documented in Vite official guides and OpenWeatherMap API behavior

**Research date:** 2026-01-31
**Valid until:** 2026-03-31 (60 days - stable technologies, but API might update)

**Notes:**
- No additional npm packages required
- TypeScript interfaces should be created manually (no @types package available)
- Project already has proper gitignore for *.local files
- Current project uses TypeScript 5.9.3 with project references (tsconfig.json, tsconfig.app.json, tsconfig.node.json)
