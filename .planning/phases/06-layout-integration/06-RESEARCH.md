# Phase 6: Layout Integration - Research

**Researched:** 2026-01-31
**Domain:** CSS Flexbox Layout / React Component Composition
**Confidence:** HIGH

## Summary

Layout integration using CSS Flexbox is the standard approach for one-dimensional layouts like headers with left/right alignment. The phase requires creating a header component that displays a date component on the left and a weather widget placeholder on the right using flexbox properties.

The standard approach uses `display: flex` with `justify-content: space-between` to push items to opposite edges, `align-items: center` for vertical alignment, and the `gap` property for consistent spacing. React component composition follows the single responsibility principle: create a dedicated Header component that composes existing DateDisplay and a new WeatherWidget placeholder.

No additional libraries are needed - native CSS Flexbox and React props are sufficient. The main pitfalls involve forgetting to set `display: flex` on the container, text overflow issues when items don't have proper constraints, and confusion about when flexbox items wrap.

**Primary recommendation:** Use CSS Flexbox with `justify-content: space-between` for left/right layout, create a Header component to compose child elements, and use semantic HTML structure.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Flexbox | Native | One-dimensional layout | W3C standard, universal browser support, designed for this exact use case |
| React | 19.2.0 | Component composition | Already in project, standard for UI composition |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| N/A | - | - | No additional libraries needed for basic layout |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Flexbox | CSS Grid | Grid is two-dimensional; overkill for single-row header layout |
| Flexbox | Absolute positioning | Breaks responsive behavior, harder to maintain |
| Flexbox | Inline-block/floats | Legacy approach, more CSS, less maintainable |

**Installation:**
```bash
# No installation needed - using native CSS and existing React
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── DateDisplay.tsx      # Existing - displays formatted date
│   ├── WeatherWidget.tsx    # New - weather placeholder
│   └── Header.tsx           # New - layout container
└── App.tsx                  # Composes Header
```

### Pattern 1: Header Component with Flexbox Layout
**What:** Create a dedicated Header component that uses CSS Flexbox to arrange child components horizontally with left/right alignment
**When to use:** Any time you need a horizontal layout with items on opposite sides (navigation bars, headers, toolbars)
**Example:**
```typescript
// Source: MDN Flexbox documentation + React composition patterns
// Header.tsx
type HeaderProps = {
  color: string;
};

function Header({ color }: HeaderProps) {
  return (
    <header className="header">
      <DateDisplay color={color} />
      <WeatherWidget />
    </header>
  );
}

export default Header;
```

```css
/* Source: MDN Flexbox Typical Use Cases */
.header {
  display: flex;
  justify-content: space-between;  /* Push items to edges */
  align-items: center;             /* Vertical centering */
  gap: 2rem;                       /* Spacing between items */
  padding: 1rem;
}
```

### Pattern 2: Component Composition with Props
**What:** Pass props from parent (App) to Header, and Header forwards them to child components
**When to use:** When child components need data controlled by the parent
**Example:**
```typescript
// Source: React documentation - Passing Props to a Component
// App.tsx
function App() {
  const [color, setColor] = useState('#000000');

  return (
    <>
      <Header color={color} />
      <Button onClick={handleColorChange} />
    </>
  );
}

// Header forwards color prop to DateDisplay
function Header({ color }: HeaderProps) {
  return (
    <header className="header">
      <DateDisplay color={color} />
      <WeatherWidget />
    </header>
  );
}
```

### Pattern 3: Placeholder Component
**What:** Create a simple component that displays placeholder content before real implementation
**When to use:** Iterative development where full functionality comes later
**Example:**
```typescript
// WeatherWidget.tsx - Phase 6 placeholder
function WeatherWidget() {
  return (
    <div className="weather-widget">
      <span>Geneva</span>
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Using margin-left: auto on multiple items:** Can cause unexpected layout behavior. Use `justify-content: space-between` instead for predictable left/right alignment.
- **Nesting flex containers unnecessarily:** Keep structure flat when possible. Header should directly contain DateDisplay and WeatherWidget, not intermediate wrappers.
- **Setting explicit widths on flex items:** Let flexbox handle sizing unless specific constraints are needed. Using `width: 50%` defeats the purpose of flexible layout.
- **Forgetting vertical alignment:** Items may not align properly without `align-items: center` on the container.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Horizontal spacing | Manual margin calculations | CSS `gap` property | Modern, consistent, responsive, works with wrapping |
| Left/right alignment | Custom positioning logic | `justify-content: space-between` | Standard pattern, less CSS, more maintainable |
| Vertical centering | Manual padding/positioning | `align-items: center` | Works for any height, no magic numbers |

**Key insight:** CSS Flexbox is specifically designed for one-dimensional layouts. Using it correctly requires less code than manual positioning approaches and automatically handles responsive behavior.

## Common Pitfalls

### Pitfall 1: Forgetting display: flex on Container
**What goes wrong:** Child elements don't align horizontally even with justify-content/align-items set
**Why it happens:** Flexbox properties only work when `display: flex` is set on the parent container
**How to avoid:** Always start with `display: flex` on the container before setting alignment properties
**Warning signs:** Items stack vertically instead of horizontally; spacing properties have no effect

### Pitfall 2: Text Overflow in Flex Items
**What goes wrong:** Long text overflows the container or causes unwanted horizontal scrolling
**Why it happens:** Flex items have a default minimum size based on their content (min-width: auto)
**How to avoid:** Set `min-width: 0` on flex items that contain text, or use `overflow: hidden` with `text-overflow: ellipsis`
**Warning signs:** Date or location text breaking layout on small screens

### Pitfall 3: Confusion About flex-direction
**What goes wrong:** Items don't align as expected; vertical/horizontal alignment seems reversed
**Why it happens:** `justify-content` works on main axis, `align-items` on cross axis; these swap when flex-direction changes
**How to avoid:** For horizontal headers, keep default `flex-direction: row`; remember justify = horizontal, align = vertical in row mode
**Warning signs:** Using `align-items: space-between` or `justify-content: center` for the wrong axis

### Pitfall 4: Not Testing Responsive Behavior
**What goes wrong:** Layout breaks on mobile devices; items overlap or create horizontal scroll
**Why it happens:** Fixed spacing or lack of `gap` property makes items too close or too far apart
**How to avoid:** Test at different viewport widths; use `gap` for consistent spacing; consider `flex-wrap: wrap` for very narrow screens
**Warning signs:** Items touching each other on mobile; horizontal scrollbar appears

### Pitfall 5: Over-nesting Components
**What goes wrong:** Props drilling through multiple layers; unnecessary wrapper components
**Why it happens:** Creating components for every div instead of following single responsibility principle
**How to avoid:** Header should directly contain DateDisplay and WeatherWidget; don't create HeaderLeft/HeaderRight wrappers unless they have distinct responsibilities
**Warning signs:** Components with no logic that just render children; passing same props through multiple levels

## Code Examples

### Basic Header Layout
```typescript
// Source: React official documentation + MDN Flexbox patterns
// Header.tsx
type HeaderProps = {
  color: string;
};

function Header({ color }: HeaderProps) {
  return (
    <header className="header">
      <DateDisplay color={color} />
      <WeatherWidget />
    </header>
  );
}

export default Header;
```

```css
/* Source: MDN CSS Flexible Box Layout - Typical Use Cases */
.header {
  display: flex;
  justify-content: space-between;  /* Left/right alignment */
  align-items: center;             /* Vertical centering */
  gap: 2rem;                       /* Space between items */
  padding: 1rem;
}
```

### Weather Widget Placeholder
```typescript
// WeatherWidget.tsx
function WeatherWidget() {
  return (
    <div className="weather-widget">
      <span className="weather-location">Geneva</span>
    </div>
  );
}

export default WeatherWidget;
```

```css
.weather-widget {
  display: flex;
  align-items: center;
}

.weather-location {
  font-size: 1rem;
}
```

### App Integration
```typescript
// App.tsx - Updated to use Header
import { useState } from 'react'
import Header from './components/Header'
import Button from './components/Button'
import './App.css'

function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function App() {
  const [color, setColor] = useState('#000000');

  const handleColorChange = () => {
    setColor(generateRandomColor());
  };

  return (
    <>
      <Header color={color} />
      <Button onClick={handleColorChange} />
    </>
  )
}

export default App
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Float-based layouts | Flexbox | ~2015 (IE11 support) | Simpler CSS, better responsive behavior |
| Manual margins for spacing | CSS `gap` property | ~2020 (broad support) | Consistent spacing without margin calculations |
| Inline-block + white-space tricks | Flexbox justify-content | ~2015 | Predictable alignment without hacks |

**Deprecated/outdated:**
- **Float + clearfix:** Replaced by flexbox for layout
- **Table display:** Replaced by flexbox for alignment
- **Inline-block with font-size: 0:** Replaced by flexbox gap

## Open Questions

1. **Responsive breakpoint for header**
   - What we know: Flexbox works well for headers; gap property handles spacing
   - What's unclear: Whether header should stack vertically on mobile or remain horizontal
   - Recommendation: Keep horizontal unless requirements specify otherwise; date and location are short enough to fit on mobile

## Sources

### Primary (HIGH confidence)
- MDN Web Docs: CSS Flexible Box Layout - Basic Concepts (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)
- MDN Web Docs: Aligning Items in a Flex Container (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container)
- MDN Web Docs: Typical Use Cases of Flexbox (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Typical_Use_Cases_of_Flexbox)
- MDN Web Docs: Mastering Wrapping of Flex Items (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Mastering_Wrapping_of_Flex_Items)
- React Official Docs: Passing Props to a Component (https://react.dev/learn/passing-props-to-a-component)
- React Official Docs: Thinking in React (https://react.dev/learn/thinking-in-react)

### Secondary (MEDIUM confidence)
- N/A

### Tertiary (LOW confidence)
- N/A

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native CSS and React, verified with official documentation
- Architecture: HIGH - Patterns documented in official MDN and React guides
- Pitfalls: HIGH - Common issues documented in MDN flexbox mastery guide

**Research date:** 2026-01-31
**Valid until:** 2026-03-02 (30 days - stable CSS/React patterns)
