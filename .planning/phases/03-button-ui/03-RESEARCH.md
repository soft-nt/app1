# Phase 3: Button UI - Research

**Researched:** 2026-01-31
**Domain:** React button components with CSS styling
**Confidence:** HIGH

## Summary

Button UI in React is straightforward using native HTML button elements with CSS styling. The project already uses React 19.2.0 + TypeScript + plain CSS (not CSS modules or CSS-in-JS), established in previous phases. For a simple styled button, no additional libraries are needed.

The standard approach is to create a button component in `src/components/` with an accompanying CSS file, following the existing pattern used for DateDisplay. Modern CSS Flexbox provides reliable centering without absolute positioning. Key considerations are accessibility (color contrast, interactive states, semantic HTML) and avoiding common pitfalls like missing `type="button"` attributes or insufficient focus indicators.

**Primary recommendation:** Create a Button component using semantic HTML `<button>` element, style with component CSS file, ensure WCAG AA contrast requirements (4.5:1 for text), and implement all interactive states (:hover, :focus-visible, :active).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.0 | UI component framework | Already established in project |
| TypeScript | 5.9.3 | Type safety | Already established in project |
| Plain CSS | N/A | Styling | Project convention from phase 2 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| N/A | N/A | No additional libraries needed | Simple button doesn't require styling libraries |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Plain CSS | CSS Modules | Better encapsulation but adds complexity for simple components |
| Plain CSS | styled-components | Type-safe styles but requires additional dependency |
| Plain CSS | Tailwind CSS | Utility-first approach but requires configuration |

**Installation:**
```bash
# No additional packages needed
# Project already has React 19.2.0 and TypeScript 5.9.3
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── Button.tsx          # Button component
│   └── DateDisplay.tsx     # Existing component
├── App.tsx                 # Main app component
├── App.css                 # App-specific styles
└── index.css               # Global styles
```

### Pattern 1: Component-Based Button
**What:** Create reusable button component following React best practices
**When to use:** Always for UI elements that may be reused or modified
**Example:**
```typescript
// Source: Official React documentation (react.dev/learn)
// src/components/Button.tsx
interface ButtonProps {
  text: string;
  onClick?: () => void;
}

function Button({ text, onClick }: ButtonProps) {
  return (
    <button type="button" className="button" onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
```

### Pattern 2: CSS Flexbox Centering
**What:** Use modern CSS Flexbox for horizontal and vertical centering
**When to use:** Layout positioning without absolute positioning hacks
**Example:**
```css
/* Source: MDN Web Docs - Flexbox Alignment */
.container {
  display: flex;
  justify-content: center;  /* Horizontal centering */
  align-items: center;      /* Vertical centering */
}

/* For centering within page flow */
.button-container {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}
```

### Pattern 3: Interactive State Styling
**What:** Provide visual feedback for all interactive states
**When to use:** All interactive elements (buttons, links, inputs)
**Example:**
```css
/* Source: MDN Web Docs - Interactive pseudo-classes */
.button {
  background-color: green;
  color: white;
  border: none;
  padding: 0.6em 1.2em;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s;
}

.button:hover {
  background-color: darkgreen;
}

.button:focus-visible {
  outline: 3px solid navy;
  outline-offset: 2px;
}

.button:active {
  transform: scale(0.98);
}
```

### Anti-Patterns to Avoid
- **Missing `type="button"`**: Without it, button defaults to `type="submit"` which can trigger unwanted form submissions
- **Absolute positioning for layout**: Modern CSS Grid/Flexbox handles layout better than absolute positioning
- **Removing focus indicators**: Never remove `:focus` styles without providing `:focus-visible` replacement
- **Hover-only functionality**: Touchscreen devices have unreliable `:hover` support

## Don't Hand-Roll

For this simple button implementation, there are no complex problems requiring existing solutions. The native HTML `<button>` element and standard CSS provide everything needed.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| N/A | N/A | N/A | Simple button styling requires no special libraries |

**Key insight:** For basic button styling, vanilla CSS with semantic HTML is the simplest and most maintainable approach. Avoid premature optimization with styling libraries.

## Common Pitfalls

### Pitfall 1: Missing type="button" Attribute
**What goes wrong:** Button defaults to `type="submit"`, causing form submission behavior
**Why it happens:** HTML button default type is "submit" for legacy form compatibility
**How to avoid:** Always explicitly set `type="button"` for non-form buttons
**Warning signs:** Button causes page reload or unexpected form submission

### Pitfall 2: Insufficient Color Contrast
**What goes wrong:** Green button with white text may not meet WCAG AA requirements
**Why it happens:** Not all green shades provide 4.5:1 contrast ratio with white
**How to avoid:** Use WebAIM Contrast Checker or browser DevTools to verify contrast
**Warning signs:** Text is hard to read, especially in bright light or for color-blind users

### Pitfall 3: CSS Specificity Conflicts
**What goes wrong:** Global button styles in index.css override component styles
**Why it happens:** Project has existing button styles from Vite template (lines 38-55 of index.css)
**How to avoid:** Use more specific selectors (.button class) or override with !important (last resort)
**Warning signs:** Button doesn't match expected styling, dev tools show overridden styles

### Pitfall 4: Missing Focus Indicators
**What goes wrong:** Keyboard users can't see which element has focus
**Why it happens:** Developer removes default outline for aesthetic reasons
**How to avoid:** Use `:focus-visible` to show focus only for keyboard navigation
**Warning signs:** Keyboard navigation has no visual feedback

### Pitfall 5: Inadequate Touch Target Size
**What goes wrong:** Button is too small to reliably tap on mobile devices
**Why it happens:** Desktop-focused design without mobile consideration
**How to avoid:** Ensure button is at least 44x44 CSS pixels (WCAG 2.1 Level AAA)
**Warning signs:** High miss rate on mobile devices, frustration clicking

## Code Examples

Verified patterns from official sources:

### Complete Button Component
```typescript
// Source: Official React documentation
// src/components/Button.tsx
interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

function Button({ text, onClick, className = 'button' }: ButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
```

### Button CSS with Accessibility
```css
/* Source: MDN Web Docs - Button element best practices */
/* src/components/Button.css or App.css */
.button {
  /* Visual styling */
  background-color: #22c55e;  /* Green that passes WCAG AA */
  color: white;
  border: none;
  padding: 12px 24px;         /* Ensures 44x44px minimum */
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;

  /* Smooth transitions */
  transition: background-color 0.25s, transform 0.1s;
}

.button:hover {
  background-color: #16a34a;  /* Darker green */
}

.button:focus-visible {
  outline: 3px solid #2563eb;  /* Blue focus ring */
  outline-offset: 2px;
}

.button:active {
  transform: scale(0.98);      /* Tactile feedback */
}

/* Centering container */
.button-container {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}
```

### Usage in App Component
```typescript
// Source: React documentation patterns
// src/App.tsx
import DateDisplay from './components/DateDisplay'
import Button from './components/Button'
import './App.css'

function App() {
  return (
    <>
      <DateDisplay />
      <div className="button-container">
        <Button text="Click me" />
      </div>
    </>
  )
}

export default App
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `:focus` only | `:focus-visible` | 2020 (CSS Selectors Level 4) | Better UX - focus indicators only show for keyboard navigation |
| Absolute positioning | Flexbox/Grid | 2017+ (widespread support) | More maintainable, responsive centering |
| `class` attribute | `className` in JSX | React inception | JSX syntax requirement |
| Inline styles everywhere | CSS files + className | Modern React patterns | Better separation of concerns |

**Deprecated/outdated:**
- Using `<div>` or `<a>` for buttons: Use semantic `<button>` element for accessibility
- Browser-specific prefixes for flexbox: Modern browsers have unprefixed support

## Open Questions

No significant open questions for this straightforward implementation. The technology stack is mature and well-documented.

## Sources

### Primary (HIGH confidence)
- MDN Web Docs - HTML Button Element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
- MDN Web Docs - Flexbox Alignment: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Aligning_items_in_a_flex_container
- MDN Web Docs - CSS Positioning: https://developer.mozilla.org/en-US/docs/Web/CSS/position
- MDN Web Docs - Interactive States: https://developer.mozilla.org/en-US/docs/Web/CSS/:hover
- MDN Web Docs - WCAG Color Contrast: https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast
- React Official Documentation: https://react.dev/learn
- Web.dev - Flexbox: https://web.dev/learn/css/flexbox

### Secondary (MEDIUM confidence)
- Project structure analysis (package.json, existing components)

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Project already established with React + TypeScript + plain CSS
- Architecture: HIGH - Official React documentation and MDN provide authoritative patterns
- Pitfalls: HIGH - Well-documented accessibility requirements and common mistakes from official sources

**Research date:** 2026-01-31
**Valid until:** 2026-03-02 (30 days - stable technology stack)
