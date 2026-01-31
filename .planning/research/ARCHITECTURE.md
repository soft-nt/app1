# Architecture Research

**Domain:** React component integration with API data fetching
**Researched:** 2026-01-31
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     App.tsx (Container)                      │
│  - State management (color, weather data)                    │
│  - Layout structure                                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ DateDisplay  │  │   Weather    │  │   Button     │      │
│  │ (presentational)│ (smart)       │  │(presentational)│    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │              │
│      receives          manages              receives        │
│      color prop        own state            onClick         │
├─────────────────────────────────────────────────────────────┤
│                     Custom Hooks Layer                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  useWeather(location)                               │    │
│  │  - Manages loading/error/data states                │    │
│  │  - Handles race conditions                          │    │
│  │  - useEffect for API fetch                          │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                     External Layer                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Weather API Service                      │   │
│  │              (fetch to external API)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **App.tsx** | Layout container, shared state | useState for color, renders header layout with DateDisplay + Weather |
| **DateDisplay** | Presentational component | Receives color prop, displays formatted date |
| **Weather** | Smart component with local state | Uses useWeather hook, manages loading/error/data display |
| **Button** | Presentational component | Receives onClick prop, triggers color change |
| **useWeather** | Custom hook for API logic | useEffect + useState for async data, handles race conditions |

## Recommended Project Structure

### Current Structure
```
src/
├── components/
│   ├── DateDisplay.tsx    # Presentational component (existing)
│   ├── Button.tsx         # Presentational component (existing)
│   └── Weather.tsx        # NEW: Smart component with API integration
├── hooks/
│   └── useWeather.ts      # NEW: Custom hook for weather API logic
├── App.tsx                # Container with state management
└── App.css                # Styles
```

### Structure Rationale

- **components/:** All UI components, both presentational and smart
  - **DateDisplay.tsx:** Existing, no changes needed
  - **Button.tsx:** Existing, no changes needed
  - **Weather.tsx:** NEW component that uses useWeather hook, manages its own display logic

- **hooks/:** Custom hooks for reusable stateful logic
  - **useWeather.ts:** Encapsulates API call, loading/error/data states, race condition handling

- **App.tsx:** Container that orchestrates layout
  - Keeps existing color state management
  - Adds header layout structure (flexbox with DateDisplay left, Weather right)
  - Does NOT manage weather state (that's local to Weather component)

## Architectural Patterns

### Pattern 1: Component Colocation of Related State

**What:** Keep state as close as possible to where it's used. Weather state lives in Weather component, not lifted to App.

**When to use:** When state is only needed by one component and its children. Weather data is only used by Weather component, so it shouldn't be in App.

**Trade-offs:**
- **Pro:** Simpler data flow, easier to reason about, follows React's composition model
- **Pro:** Weather component can be moved/reused without affecting App
- **Con:** If multiple components need weather data later, state would need to be lifted

**Example:**
```typescript
// Weather.tsx (Smart Component)
function Weather() {
  const { data, loading, error } = useWeather('San Francisco');

  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>Error loading weather</div>;
  if (!data) return null;

  return (
    <div className="weather">
      <span>{data.temp}°F</span>
      <span>{data.condition}</span>
    </div>
  );
}
```

### Pattern 2: Custom Hook for API Logic

**What:** Extract useEffect + API logic into a custom hook that returns { data, loading, error }

**When to use:** For any API call or complex side effect. Separates concerns: component handles UI, hook handles data fetching.

**Trade-offs:**
- **Pro:** Reusable across components
- **Pro:** Easier to test (mock the hook)
- **Pro:** Hides race condition complexity from component
- **Con:** Adds one more file/abstraction

**Example:**
```typescript
// hooks/useWeather.ts
export function useWeather(location: string) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false; // Race condition guard

    (async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/weather?location=${location}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();

        if (!ignore) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setData(null);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; }; // Cleanup: ignore stale responses
  }, [location]);

  return { data, loading, error };
}
```

### Pattern 3: Layout Component with Flexbox

**What:** Modify App.tsx to create a header layout with date left, weather right using flexbox

**When to use:** For simple horizontal layouts without needing a dedicated Header component

**Trade-offs:**
- **Pro:** Keeps it simple, avoids premature abstraction
- **Pro:** All layout logic visible in one file
- **Con:** If header gets complex (navigation, etc.), would need refactor to Header.tsx

**Example:**
```typescript
// App.tsx
function App() {
  const [color, setColor] = useState('#000000');

  const handleColorChange = () => {
    setColor(generateRandomColor());
  };

  return (
    <>
      <div className="header">
        <DateDisplay color={color} />
        <Weather />
      </div>
      <Button onClick={handleColorChange} />
    </>
  )
}
```

```css
/* App.css */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}
```

## Data Flow

### Request Flow

```
[Component Mount: Weather.tsx]
    ↓
[useWeather hook executes]
    ↓
[useEffect runs] → [fetch API] → [External Weather API]
    ↓                   ↓              ↓
[setState: loading] ← [Response] ← [JSON Data]
    ↓
[Component re-renders with data]
```

### State Management

```
App.tsx
  ├─ color (useState)          → DateDisplay receives as prop
  ├─ handleColorChange         → Button receives as prop
  └─ Layout structure          → Renders DateDisplay + Weather + Button

Weather.tsx
  └─ useWeather hook
      ├─ data (useState)       → Internal to Weather component
      ├─ loading (useState)    → Internal to Weather component
      └─ error (useState)      → Internal to Weather component
```

### Key Data Flows

1. **Color flow (existing):** App maintains color state → passes to DateDisplay as prop → Button onClick updates App state
2. **Weather flow (new):** Weather component → useWeather hook → API fetch → Weather component re-renders with data
3. **Independent states:** Color and weather states don't interact, properly isolated

## Integration Points

### Component Integration Strategy

**Modification points:**
1. **App.tsx** - Add header div wrapper around DateDisplay, add Weather component
2. **App.css** - Add flexbox styles for .header class
3. **NEW: src/components/Weather.tsx** - Create smart component
4. **NEW: src/hooks/useWeather.ts** - Create custom hook

**Existing components unchanged:**
- DateDisplay.tsx - No modifications needed
- Button.tsx - No modifications needed

### Build Order Recommendation

**Phase 1: Layout Structure (No API)**
1. Modify App.tsx to add header div with flexbox
2. Add Weather placeholder component (returns static JSX)
3. Update App.css with header styles
4. Verify layout works (date left, weather placeholder right)

**Phase 2: API Integration**
5. Create hooks/useWeather.ts with mock data first
6. Update Weather.tsx to use useWeather hook
7. Test with mock data
8. Replace mock with actual API fetch
9. Add loading/error states

**Rationale:** Build layout first so you can see changes, then add data complexity

## Anti-Patterns

### Anti-Pattern 1: Lifting Weather State to App

**What people do:** Put weather state in App.tsx because "App manages state"

**Why it's wrong:**
- Weather data is only used by Weather component
- Violates component colocation principle
- Makes App.tsx responsible for too many concerns
- Harder to reuse Weather component

**Do this instead:** Keep weather state local to Weather component via useWeather hook

### Anti-Pattern 2: Inline useEffect in Component

**What people do:** Put fetch logic directly in Weather component's useEffect

**Why it's wrong:**
- Mixes UI logic with data fetching logic
- Harder to test
- Not reusable if another component needs weather data
- Component becomes bloated

**Do this instead:** Extract to useWeather custom hook

### Anti-Pattern 3: Missing Race Condition Guard

**What people do:** Forget to add cleanup function to useEffect

```typescript
// BAD: No cleanup
useEffect(() => {
  fetch(url).then(data => setState(data));
}, [url]);
```

**Why it's wrong:** If url changes quickly (e.g., user types fast), responses may arrive out of order, causing stale data to overwrite fresh data

**Do this instead:** Always add cleanup with ignore flag

```typescript
// GOOD: Cleanup prevents race conditions
useEffect(() => {
  let ignore = false;
  fetch(url).then(data => {
    if (!ignore) setState(data);
  });
  return () => { ignore = true; };
}, [url]);
```

### Anti-Pattern 4: Creating Premature Header Component

**What people do:** Immediately create Header.tsx component for date + weather

**Why it's wrong:**
- Premature abstraction for simple layout
- Adds complexity without clear benefit
- Harder to pass props (color needs to flow App → Header → DateDisplay)

**Do this instead:** Keep layout in App.tsx until header gets complex (3+ items, navigation, etc.)

## External Services

### Weather API Integration

| Aspect | Pattern | Notes |
|--------|---------|-------|
| **API calls** | In custom hook (useWeather) | Not in component, not in App |
| **Error handling** | Return error state from hook | Component decides how to display |
| **Loading state** | Return loading boolean from hook | Show spinner/skeleton while loading |
| **Race conditions** | Cleanup function with ignore flag | Critical for preventing stale data |
| **Caching** | Not needed for MVP | Consider useSWR/React Query later if needed |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **Current (MVP)** | useEffect in custom hook is fine. Simple loading/error/data pattern. |
| **Multiple API calls** | Consider React Query or SWR library for caching, deduplication, revalidation |
| **Complex state** | If App state grows (user prefs, multiple widgets), consider Context or state management library |
| **Server-side rendering** | If adding SSR later, move to Next.js data fetching patterns (getServerSideProps) |

### Scaling Priorities

1. **First bottleneck:** Multiple weather API calls if user changes location frequently → Add caching with React Query/SWR
2. **Second bottleneck:** App.tsx becomes cluttered with layout logic → Extract to Header.tsx component when 3+ header items exist

## Sources

- **HIGH confidence:** React Official Documentation (react.dev)
  - Custom Hooks: https://react.dev/learn/reusing-logic-with-custom-hooks
  - useEffect Best Practices: https://react.dev/learn/you-might-not-need-an-effect
  - Component Composition: https://react.dev/learn/thinking-in-react
- **HIGH confidence:** React version 19.2.4 (current as of January 2026)
- **HIGH confidence:** Existing codebase analysis (App.tsx, DateDisplay.tsx, Button.tsx)

---
*Architecture research for: Weather widget integration into React app*
*Researched: 2026-01-31*
