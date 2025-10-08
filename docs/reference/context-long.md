

# Project Context – OK Colf App (Express)

**Type:** Progressive Web App (PWA), mobile-first, offline-first with optional backend sync.

---

## Stack

- UI: OnsenUI + Alpine.js
- Utilities: jQuery (only if needed)
- Offline storage: sql.js (`db.js`)
- Backend: Firebase or PocketBase (`api.js`)
- Target: PWA (manifest + SW)

---

## Structure

The repository is organised as a mobile-first PWA. Key files and folders at a glance:

- Root
  - `index.html` — lightweight entry/landing page
  - `package.json` — project metadata / scripts (if present)
  - `README.md` — project overview and instructions
  - `docs/` — project documentation and reference material
  - `html/` — legacy or example HTML pages (UI fragments)
  - `js/` 
    - `app.js` — bootstrap, routing, and SW registration
    - `auth.js` — authentication helpers
    - `db.js` — sql.js offline DB utilities
    - `api.js` — backend abstraction (Firebase / PocketBase)
    - `state.js` — in-memory state & session management
    - `ui.js` — toast, loader, and UI helpers
  - `lib/` — third-party libraries (includes `onsen/` assets)
  - `public/` — PWA public assets and service worker
  - `src/` — primary source for the app (css, js, views, components)

- `public/`
  - `index.html` — app entrypoint (OnsenUI + Alpine.js)
  - `manifest.json` — PWA manifest
  - `service-worker.js` — service worker and caching
  - `icons/` — generated icons and favicons

- `src/`
  - `css/`
    - `main.css` — global styles
    - `variables.css` — color palette and CSS variables
  - `js/` (ES Modules preferred)




---

## Code & Dependency Management

- AI can autonomously modify `.html`, `.css`, `.js` files and create new files with correct linking in `index.html`.
- Include OnsenUI, Alpine.js, and jQuery via **CDN with SRI**, or npm if `package.json` exists.
- Backend SDKs (Firebase or PocketBase) via CDN.
- Prefer ES Modules for organization; jQuery only for complex DOM or legacy support.

---

## Development Rules

- Use **modern JS**: arrow functions, destructuring, spread/rest operators, optional chaining (`?.`)
- Async/await for asynchronous operations
- `fetch` or `$.ajax` for network requests
- Modularize code using ES Modules (`import` / `export`)

---

## Rules & Conventions

- AI can modify HTML/CSS/JS, create new files, ensure linking.
- Prefer ES Modules; jQuery only for complex DOM/legacy code.
- Use modern JS (arrow functions, async/await, destructuring, optional chaining).
- Fetch or $.ajax for network; backend abstracted in `api.js`.

---

## UI Components (OnsenUI + Alpine.js)

- **Core elements:** Onsen UI elements
- **Alpine.js bindings:** Data binding, forms data
- **jQuery:** only for DOM manipulation, animations, or legacy plugins. Do not break Alpine bindings.
- Mobile-first, responsive, clean typography, drop shadows, gradients, vibrant palette.
- Placeholder images allowed; iconography from Onsen UI or third-party sets.
- ⚠️ Beware to not break Alpine data binding.

---

## Visual Design & UX

- Mobile-first, responsive layout
- Clean, modern aesthetics with OnsenUI
- **Guidelines:**
  - Typography hierarchy (hero text, section headers, list headers)
  - Balanced spacing, drop shadows, gradients
  - Vibrant, extensible color palette (`variables.css`)
  - Iconography: Onsen UI or third-party sets
- Placeholder images allowed if real assets unavailable

---

## Backend Integration

- **PocketBase:** JS SDK; supports collections, authentication, files, real-time subscriptions
- Abstract all backend operations in `api.js` to allow swapping backend with minimal code changes

---

## Offline-first Strategy

- SQL.js for local data (`db.js`)
- Background sync to cloud (PocketBase)
- Persistent sessions for auto-login
- PocketBase: collections, auth, files, real-time
- All backend ops via `api.js` for easy swapping

---

## Authentication

- Pocketbase: Auth
- All auth ops via `auth.js` for easy swapping
- Persistent sessions for auto-login

---

## Features

- [ ] Scaffolding base
- [ ] Manifest.json + SW
- [ ] Navigazione Tabbar OnsenUI
- [ ] Firebase login/logout
- [ ] Registrazione utente
- [ ] CRUD come blueprint.md offline (sql.js)








