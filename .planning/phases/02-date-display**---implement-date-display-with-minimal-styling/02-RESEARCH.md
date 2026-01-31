# Phase 2: Date Display - Research

**Researched:** 2026-01-31
**Domain:** React date display and JavaScript date formatting
**Confidence:** HIGH

## Summary

Research focused on implementing date display in React with minimal styling. The standard approach uses JavaScript's native `Intl.DateTimeFormat` API for formatting dates, which is widely supported (baseline since 2017) and requires no external dependencies. For a simple "display current date at top of page" requirement, native browser APIs are sufficient and preferable to adding external libraries.

The project already uses Vite's react-ts template with standard CSS files and className-based styling. This setup is production-ready and requires no additional configuration. Date display should follow the existing pattern: create a component that renders the date in JSX with curly braces, style it with a CSS class in existing stylesheets.

**Primary recommendation:** Use native `new Date().toLocaleDateString()` or `Intl.DateTimeFormat` for date formatting. No external libraries needed for this phase's simple requirements.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Intl.DateTimeFormat | Native | Locale-sensitive date formatting | Built into all modern browsers since 2017, zero dependencies, supports 40+ locales |
| Date | Native | Date object creation | JavaScript standard, universally available |
| React | 19.2.0 | UI framework | Already installed in project |
| CSS | Native | Styling | Vite template includes CSS support out-of-box |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| date-fns | 4.1.0 | Date manipulation utility library | Complex date operations (range calculations, relative time, 200+ utility functions) |
| Day.js | 2.x | Lightweight date library | Need Moment.js-like API with minimal bundle size (2kB) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Intl.DateTimeFormat | date-fns | Adds dependency (600kB uncompressed) for features not needed in this phase |
| Native Date | Day.js | Adds 2kB for features not needed yet |
| Native formatting | Moment.js | **DEPRECATED** - Moment.js is in maintenance mode, not recommended for new projects |

**Installation:**
```bash
# No installation needed - using native APIs
# If future phases need advanced features:
npm install date-fns      # 36.4k stars, 4.4M users, tree-shakeable
npm install dayjs         # Lightweight alternative (2kB)
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/          # React components
│   └── DateDisplay.tsx  # Date display component
├── App.tsx              # Main app component
├── App.css              # Component-specific styles
└── index.css            # Global styles
```

### Pattern 1: Functional Component with Native Date Formatting
**What:** Display current date using native JavaScript Date and Intl APIs in a React functional component
**When to use:** Simple date display requirements, no complex date manipulation needed
**Example:**
```typescript
// Source: React official docs (https://react.dev/learn) + MDN Intl.DateTimeFormat
function DateDisplay() {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);

  return (
    <div className="date-display">
      {formattedDate}
    </div>
  );
}
```

### Pattern 2: Simple toLocaleDateString
**What:** Use the simpler Date method for basic formatting
**When to use:** When default locale formatting is acceptable
**Example:**
```typescript
// Source: MDN Date documentation
function DateDisplay() {
  return (
    <div className="date-display">
      {new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </div>
  );
}
```

### Pattern 3: CSS Styling for Minimal Design
**What:** Use existing Vite template CSS patterns with className
**When to use:** All component styling in this project
**Example:**
```css
/* Source: Existing project patterns in index.css and App.css */
.date-display {
  font-size: 1.2em;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.87);
}

@media (prefers-color-scheme: light) {
  .date-display {
    color: #213547;
  }
}
```

### Anti-Patterns to Avoid
- **Date string parsing**: Never use `new Date("December 17, 1995")` - string parsing is inconsistent across browsers. Use ISO 8601 format or constructor arguments.
- **Adding libraries prematurely**: Don't install date-fns or Day.js until you need their features (complex operations, relative time, etc.)
- **Inline styles**: Project uses external CSS files with className - maintain consistency
- **Manual date formatting**: Don't build strings like `${month}/${day}/${year}` - use Intl.DateTimeFormat for locale-aware formatting

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Date formatting | String concatenation with getMonth(), getDate() | Intl.DateTimeFormat or toLocaleDateString() | Handles locale differences, month names in different languages, edge cases like 0-indexed months |
| Timezone conversion | Manual offset calculations | Intl.DateTimeFormat with timeZone option or date-fns | DST transitions, historical timezone changes, 400+ timezone rules |
| Relative time ("2 days ago") | Manual date math | Wait for future phase or use date-fns | Edge cases with month boundaries, leap years, DST |
| Date parsing from strings | Custom regex or split() | ISO 8601 format with Date constructor | Inconsistent browser behavior, timezone interpretation varies |

**Key insight:** JavaScript's Date object has numerous gotchas (0-indexed months, timezone confusion, DST edge cases). Native Intl APIs handle these correctly. External libraries are only needed when Intl doesn't cover your use case.

## Common Pitfalls

### Pitfall 1: Zero-Indexed Months
**What goes wrong:** Using `new Date(2026, 1, 31)` creates February 31st, which rolls over to March 3rd
**Why it happens:** Months are 0-based (0=January, 11=December) but days are 1-based
**How to avoid:** When using Date constructor, remember month 0 = January. Or use Intl.DateTimeFormat which handles this internally.
**Warning signs:** Dates off by one month, especially around month boundaries

### Pitfall 2: String Parsing Inconsistencies
**What goes wrong:** `new Date("2026-01-31")` creates UTC midnight, but `new Date("2026-01-31T00:00:00")` uses local timezone
**Why it happens:** Historical spec error in how date-only vs date-time strings are parsed
**How to avoid:** Use `new Date()` without arguments for current date/time, or ISO 8601 format with explicit timezone
**Warning signs:** Dates showing wrong day when displayed in different timezones

### Pitfall 3: Not Considering User Locale
**What goes wrong:** Hardcoding "MM/DD/YYYY" format that's confusing for international users
**Why it happens:** Assuming US date format is universal
**How to avoid:** Use Intl.DateTimeFormat which automatically adapts to user's locale, or specify explicit format options
**Warning signs:** User confusion about date meaning (01/02/2026 - is that Jan 2 or Feb 1?)

### Pitfall 4: Daylight Saving Time Edge Cases
**What goes wrong:** Times during DST transitions may not exist or occur twice
**Why it happens:** Spring forward skips an hour, fall back repeats an hour
**How to avoid:** For simple display of current date, this is not an issue. For date arithmetic, use libraries like date-fns.
**Warning signs:** One-hour discrepancies near DST transitions (March/November in US)

### Pitfall 5: Displaying Stale Dates
**What goes wrong:** Component renders once with current date, never updates when day changes
**Why it happens:** React components don't automatically re-render over time
**How to avoid:** For this phase's requirement ("date updates when page loads"), current approach is sufficient. Future phases may need setInterval or time-based re-rendering.
**Warning signs:** Date shown is from yesterday if page was loaded yesterday and never refreshed

## Code Examples

Verified patterns from official sources:

### Display Current Date (Simplest Approach)
```typescript
// Source: React docs (https://react.dev/learn) + MDN Date
function DateDisplay() {
  return (
    <div className="date-display">
      {new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </div>
  );
}

export default DateDisplay;
```

### Display Current Date (Intl.DateTimeFormat)
```typescript
// Source: MDN Intl.DateTimeFormat documentation
function DateDisplay() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="date-display">
      {formatter.format(new Date())}
    </div>
  );
}
```

### Minimal CSS Styling
```css
/* Source: Existing project patterns */
.date-display {
  font-size: 1.2em;
  margin-bottom: 2rem;
  text-align: center;
}
```

### Integration into App.tsx
```typescript
// Source: Existing project App.tsx pattern
import DateDisplay from './components/DateDisplay'
import './App.css'

function App() {
  return (
    <>
      <DateDisplay />
      {/* rest of app */}
    </>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Moment.js | Intl API, date-fns, or Day.js | ~2020 (maintenance mode) | Moment no longer recommended, modern alternatives are smaller and tree-shakeable |
| Manual string building | Intl.DateTimeFormat | Baseline 2017 | Wide browser support means native API is now preferred |
| Class components | Functional components | React 16.8+ (2019) | Hooks make functional components standard pattern |
| Inline styles | CSS classes | Always preferred in React | Better separation of concerns, easier maintenance |

**Deprecated/outdated:**
- **Moment.js**: Officially in maintenance mode since 2020. Chrome DevTools flags it for bundle size. Use Intl API for simple cases or date-fns for complex needs.
- **Date.parse() with non-ISO strings**: Inconsistent across browsers. Always use ISO 8601 format.
- **Two-digit years**: Unpredictable conversion (98 → 1998, 22 → 1922). Always use four-digit years.

**Emerging:**
- **Temporal API**: New ECMAScript proposal to replace Date. Not yet standardized (Stage 3). Not ready for production use.

## Open Questions

No blocking questions for this phase. All requirements can be met with well-established patterns.

**Note for future phases:** If requirements expand to include:
- Real-time clock updates (date/time changes while page is open)
- Relative time display ("2 days ago")
- Date range calculations
- Multiple timezone support

Then evaluate adding date-fns or Day.js at that time.

## Sources

### Primary (HIGH confidence)
- MDN Intl.DateTimeFormat - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
- MDN Date object - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
- React official documentation - https://react.dev/learn
- Moment.js deprecation notice - https://momentjs.com/docs/

### Secondary (MEDIUM confidence)
- date-fns GitHub repository - https://github.com/date-fns/date-fns (v4.1.0, Sep 2024)
- Day.js official site - https://day.js.org/ (2kB size claim)

### Tertiary (LOW confidence)
- None required for this research

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All recommendations based on official documentation and current industry standards
- Architecture: HIGH - Patterns verified from official React docs and existing project structure
- Pitfalls: HIGH - All pitfalls documented in official MDN documentation with specific warnings

**Research date:** 2026-01-31
**Valid until:** 2026-03-02 (30 days - stable domain, native APIs don't change frequently)
