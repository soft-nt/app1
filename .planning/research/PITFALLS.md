# Domain Pitfalls: Weather API Integration

**Domain:** OpenWeatherMap integration in React app
**Researched:** 2026-01-31
**Context:** First API integration - no existing async patterns

## Critical Pitfalls

### 1. Exposing API Keys in Client Bundle
**What goes wrong:** Using `VITE_API_KEY` exposes the key in bundled JavaScript, visible to anyone. OpenWeatherMap keys tied to domains can be scraped and abused, hitting your rate limits.

**Why it happens:** Misunderstanding Vite's security model - `VITE_*` prefix means "expose to browser," not "make secure."

**Consequences:** API key theft, unexpected rate limit exhaustion, potential billing charges.

**Prevention:**
- Use backend proxy endpoint (`/api/weather`) that calls OpenWeatherMap server-side
- If client-side required, use domain restrictions in OpenWeatherMap dashboard
- Never commit `.env` files - add to `.gitignore`
- Document that `VITE_*` vars are PUBLIC in README

**Detection:** Search codebase for `VITE_` + grep bundle for API key string after build.

### 2. Race Conditions in useEffect
**What goes wrong:** User changes location quickly, but responses arrive out of order. Older response overwrites newer data, showing wrong weather.

**Why it happens:** No cleanup/cancellation in useEffect - all requests complete and call setState.

**Consequences:** Stale data displayed, confusing UX, data mismatches.

**Prevention:**
```typescript
useEffect(() => {
  let ignore = false;
  fetchWeather(city).then(data => {
    if (!ignore) setWeather(data);
  });
  return () => { ignore = true; };
}, [city]);
```

**Detection:** Rapid input changes showing flickering or wrong data.

### 3. API Key Activation Delay
**What goes wrong:** API returns 401 errors for up to 2 hours after key creation. New devs think key is invalid and waste time regenerating keys.

**Why it happens:** OpenWeatherMap propagates keys across infrastructure gradually.

**Consequences:** Development blocked, confusion, repeated key generation.

**Prevention:**
- Document 2-hour wait in setup instructions
- Show user-friendly message: "New API keys take up to 2 hours to activate"
- Distinguish 401 (auth) from 404 (bad city) and 429 (rate limit) in error handling

**Detection:** 401 errors immediately after key creation.

### 4. No Rate Limit Handling
**What goes wrong:** Free tier allows 60 calls/minute. Each component mount/re-render fetches data. Dev tools open triggers extra renders. Hits 429 errors quickly.

**Why it happens:** No caching, no request deduplication, useEffect runs on every dependency change.

**Consequences:** 429 errors, feature breaks, poor UX.

**Prevention:**
- Cache responses (sessionStorage or library like SWR/TanStack Query)
- Debounce user input (location search)
- Add staleTime to prevent refetches on mount/remount
- Monitor API usage in OpenWeatherMap dashboard

**Detection:** Console shows 429 errors, frequent network requests in DevTools.

### 5. Missing TypeScript Types for API Response
**What goes wrong:** Assuming API shape leads to `undefined` errors. Weather API returns `weather[0].description` - accessing wrong path crashes app.

**Why it happens:** Not validating API response structure, assuming all fields always present.

**Consequences:** Runtime errors, app crashes, undefined values rendered.

**Prevention:**
- Define TypeScript interfaces from official API docs
- Validate response with Zod/Yup before using
- Use optional chaining: `weather?.main?.temp`
- Add fallbacks: `temp ?? 'N/A'`

**Detection:** TypeScript errors, runtime "Cannot read property of undefined."

### 6. useEffect Dependency Array Mistakes
**What goes wrong:** Empty array `[]` means fetch only on mount - city changes don't refetch. Including unstable objects causes infinite loops.

**Why it happens:** Not understanding React dependency rules, passing new object references.

**Consequences:** Stale data, infinite request loops, performance issues.

**Prevention:**
- Include primitive dependencies: `[city, units]`
- Don't include objects/functions unless memoized
- Move API call config inside useEffect
- Use ESLint rule `react-hooks/exhaustive-deps`

**Detection:** Linter warnings, infinite loops in Network tab, stale UI.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Environment Setup | Committing `.env` with API key | Add `.env*` to `.gitignore` before first commit |
| First API Call | Exposing key with `VITE_` | Use backend proxy or document domain restrictions |
| Component Integration | Race conditions from rapid changes | Add cleanup function to useEffect |
| Error Handling | Generic "Error fetching weather" | Distinguish 401/404/429 with specific messages |
| TypeScript Setup | Incorrect API response types | Generate types from actual API response |

## Confidence Assessment

**HIGH confidence** - Based on:
- Official Vite documentation on environment variables
- Official React documentation on useEffect patterns
- Official OpenWeatherMap FAQ on common errors
- Direct experience patterns with first-time API integration

## Sources

- Vite Environment Variables: https://vite.dev/guide/env-and-mode.html
- React useEffect: https://react.dev/reference/react/useEffect
- OpenWeatherMap FAQ: https://openweathermap.org/faq
- OpenWeatherMap API Docs: https://openweathermap.org/current
