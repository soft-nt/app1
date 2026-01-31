# Phase 1: Project Setup - Research

**Researched:** 2026-01-31
**Domain:** React + Vite Project Initialization
**Confidence:** HIGH

## Summary

Vite v7.3.1 is the modern standard for React project setup, offering fast development with Hot Module Replacement (HMR) and optimized production builds. The official `react-ts` template provides a minimal, production-ready starting point with React 19.2, TypeScript 5.9, and ESLint 9.

React's official documentation explicitly recommends Vite as the build tool for projects starting from scratch (as opposed to full-stack frameworks like Next.js). Vite uses esbuild for transpilation (20-30x faster than tsc) and Rollup for production builds, providing instant HMR updates (<50ms) during development.

The standard approach is to use `npm create vite@latest` with the `react-ts` template, which scaffolds a complete project with sensible defaults, standard npm scripts (`dev`, `build`, `preview`), and a conventional structure with `index.html` at the root and source code in `src/`.

**Primary recommendation:** Use official Vite `react-ts` template with zero modifications to configuration. Vite's defaults are production-ready.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vite | 7.3.1+ | Build tool and dev server | Official React recommendation, 20-30x faster than tsc, native ESM support |
| React | 19.2.3 | UI framework | User requirement, latest stable |
| React DOM | 19.2.3 | React renderer | Required for web rendering |
| TypeScript | 5.9.3 | Type system | Industry standard for React apps, better DX |
| @vitejs/plugin-react | 5.1.2 | React Fast Refresh | Official Vite plugin for React HMR |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| ESLint | 9.39.2+ | Code quality | Included in template, essential for production |
| typescript-eslint | 8.53.1+ | TypeScript linting | Included in template, pairs with ESLint |
| @types/* | Latest | TypeScript definitions | Included for React, React DOM, Node |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-ts template | react template (JavaScript) | No TypeScript, faster setup but no type safety |
| @vitejs/plugin-react | @vitejs/plugin-react-swc | SWC slightly faster but Babel has broader ecosystem |
| Vite | Create React App | CRA is deprecated, Vite is 10x+ faster |

**Installation:**
```bash
npm create vite@latest app1 -- --template react-ts
cd app1
npm install
```

## Architecture Patterns

### Recommended Project Structure

The Vite react-ts template creates this structure:

```
project-root/
├── index.html           # Entry point (at root, not in public/)
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript root config
├── tsconfig.app.json    # App-specific TS config
├── tsconfig.node.json   # Node environment TS config
├── eslint.config.js     # ESLint configuration
├── .gitignore          # Git exclusions
├── public/             # Static assets (copied as-is to dist/)
└── src/                # Application source code
    ├── assets/         # Images, fonts, etc.
    ├── main.tsx        # React root mounting point
    ├── App.tsx         # Main App component
    ├── App.css         # App component styles
    └── index.css       # Global styles
```

### Pattern 1: index.html at Root

**What:** Vite places `index.html` at project root, not in a `public/` folder
**When to use:** Always (Vite requirement)
**Why:** Vite treats HTML as part of the module graph, enabling:
- Direct `<script type="module" src="/src/main.tsx">` references
- Automatic URL rebasing and asset optimization
- No special placeholder syntax needed

**Example:**
```html
<!-- Source: https://vite.dev/guide/ -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Pattern 2: Minimal Vite Configuration

**What:** Use minimal vite.config.ts with only essential plugins
**When to use:** Initial setup (expand only when needed)
**Example:**
```typescript
// Source: https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Pattern 3: Standard npm Scripts

**What:** Use conventional script names for dev, build, preview
**When to use:** Always (set by template)
**Example:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Anti-Patterns to Avoid

- **Complex initial configuration:** Vite's defaults are production-ready. Avoid premature optimization of vite.config.ts
- **Nested index.html:** Don't put index.html in public/. Vite requires it at project root
- **Manual HMR setup:** Don't configure React Fast Refresh manually. @vitejs/plugin-react handles it
- **Opening file:// URLs:** Built files fail with CORS. Always use `npm run preview` for local testing

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dependency pre-bundling | Custom ESM conversion | Vite's automatic pre-bundling | Handles 600+ internal modules (e.g., lodash-es) automatically, converts CommonJS/UMD to ESM |
| React Fast Refresh | Manual HMR setup | @vitejs/plugin-react | Official integration, preserves component state, handles edge cases |
| TypeScript transpilation | ts-loader or manual tsc | Vite's esbuild integration | 20-30x faster than tsc, <50ms HMR updates |
| CSS code splitting | Manual extraction | Vite's automatic splitting | Extracts CSS per async chunk automatically |
| Asset optimization | Custom build scripts | Vite's built-in handling | Automatic hashing, preload directives, parallel chunk loading |

**Key insight:** Vite replaces entire webpack/CRA toolchains. Trust the defaults.

## Common Pitfalls

### Pitfall 1: File Path Case Sensitivity

**What goes wrong:** Imports work in dev (Windows/macOS) but fail in production (Linux deployment)
**Why it happens:** Windows/macOS have case-insensitive filesystems; Linux is case-sensitive
**How to avoid:**
- Use exact casing in imports: `import './App.tsx'` not `import './app.tsx'` if file is `App.tsx`
- Enable `"forceConsistentCasingInFileNames": true` in tsconfig.json (included by default)
**Warning signs:** Build succeeds locally but fails on CI/CD or Linux servers

### Pitfall 2: Stale Dependency Cache

**What goes wrong:** Changes to dependencies don't appear; dev server behaves unexpectedly
**Why it happens:** Vite caches pre-bundled dependencies in `node_modules/.vite`
**How to avoid:**
- Delete `node_modules/.vite` when dependencies change
- Or restart dev server with `npm run dev -- --force`
**Warning signs:** New package features missing, "module not found" for newly installed packages

### Pitfall 3: Dynamic Import Version Mismatch

**What goes wrong:** "Failed to fetch dynamically imported module" errors in production
**Why it happens:** Browser cached old HTML but server has new build with different chunk hashes
**How to avoid:**
- Configure proper cache headers (cache chunks, not index.html)
- Use `build.rollupOptions.output.manualChunks` for stable chunk splitting
**Warning signs:** Works immediately after deploy but fails later; errors like "chunk-abc123.js not found"

### Pitfall 4: Opening Built Files with file://

**What goes wrong:** Blank page or CORS errors when opening dist/index.html directly
**Why it happens:** `file://` protocol blocks module loading; browsers enforce CORS
**How to avoid:** Always use `npm run preview` to test builds locally with HTTP server
**Warning signs:** Build works with `npm run preview` but fails when opening file directly

### Pitfall 5: Environment Variables in Config

**What goes wrong:** `.env` variables are undefined in vite.config.ts
**Why it happens:** Vite doesn't load .env files until after config evaluation
**How to avoid:**
- Access env vars via `process.env` (already loaded by shell)
- Or manually load .env using `dotenv` package in config
**Warning signs:** Config works with inline values but breaks with env vars

### Pitfall 6: Circular Dependencies Breaking HMR

**What goes wrong:** Full page reload instead of fast refresh; state lost on every change
**Why it happens:** Circular imports prevent Vite from determining update boundaries
**How to avoid:**
- Restructure code to eliminate circular dependencies
- Use tools like `madge` to detect cycles
**Warning signs:** HMR works initially but breaks as app grows; console shows full reload messages

## Code Examples

Verified patterns from official sources:

### Creating New Project
```bash
# Source: https://vite.dev/guide/
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

### Basic App Component Structure
```typescript
// Source: Vite react-ts template
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Testing Production Build Locally
```bash
# Source: https://vite.dev/guide/static-deploy.html
npm run build      # Creates optimized bundle in dist/
npm run preview    # Serves dist/ on local HTTP server for testing
```

### Handling Static Assets
```typescript
// Source: https://vite.dev/guide/assets.html
// Assets in public/ are copied as-is
// <img src="/logo.png" /> → copies public/logo.png to dist/logo.png

// Assets imported in code get hashed for cache busting
import logo from './assets/logo.png'
// <img src={logo} /> → dist/assets/logo-abc123.png
```

### Force Rebuild Dependencies
```bash
# Source: https://vite.dev/guide/dep-pre-bundling.html
# When dependencies misbehave
npm run dev -- --force

# Or manually clear cache
rm -rf node_modules/.vite
npm run dev
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Create React App | Vite | 2021-2022 | 10x+ faster dev server, instant HMR, smaller bundles |
| webpack dev server | Vite native ESM | 2021 | No bundling in dev = instant cold start |
| Babel transpilation | esbuild | 2020-2021 | 20-30x faster TypeScript transpilation |
| Manual React Fast Refresh | @vitejs/plugin-react | 2021 | Official integration, zero config |
| React 17 | React 19 | 2024 | New JSX transform, improved performance |

**Deprecated/outdated:**
- **Create React App**: No longer maintained, React docs removed CRA from recommendations in 2023
- **Vite v4 and earlier**: Current is v7 (January 2026), use latest for Node 20+ support
- **react-scripts**: Obsolete, replaced by Vite
- **@vitejs/plugin-react-refresh**: Replaced by @vitejs/plugin-react in Vite 2.0+

## Open Questions

No open questions. All requirements are well-documented with official sources.

## Sources

### Primary (HIGH confidence)
- **Vite Official Documentation** (https://vite.dev/guide/) - Getting started, features, configuration
- **Vite Troubleshooting Guide** (https://vite.dev/guide/troubleshooting.html) - Common issues and solutions
- **Vite Dependency Pre-bundling** (https://vite.dev/guide/dep-pre-bundling.html) - Caching and optimization
- **Vite Static Deploy Guide** (https://vite.dev/guide/static-deploy.html) - Build and deployment
- **Official Vite GitHub Template** (https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) - Template structure and files
- **React Official Documentation** (https://react.dev/learn/start-a-new-react-project) - Framework recommendations

### Secondary (MEDIUM confidence)
None required - all information verified with primary official sources.

### Tertiary (LOW confidence)
None - research relied entirely on official documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions and packages verified from official Vite GitHub template and package.json
- Architecture: HIGH - Project structure documented in official Vite guide and GitHub repository
- Pitfalls: HIGH - Sourced from official Vite troubleshooting documentation

**Research date:** 2026-01-31
**Valid until:** 2026-02-28 (30 days - Vite is stable, monthly releases)
