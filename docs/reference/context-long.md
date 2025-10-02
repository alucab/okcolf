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

- `/public`
  - `index.html` (entry point con OnsenUI + Alpine.js)
  - `manifest.json` (config PWA)
  - `service-worker.js` (cache base)
  - `/icons/` (icone varie risoluzioni)
- `/src/css`
  - `main.css` (stili globali)
  - `variables.css` (palette colori)
- `/src/js`
  - `app.js` (bootstrap + routing base + SW registration)
  - `db.js` (funzioni sql.js offline)
  - `api.js` (funzioni Firebase/PocketBase)
  - `state.js` (gestione stato utente + note in memoria)
  - `ui.js` (toast, loader, ecc.)
- `/src/views`
  - `login.html`
  - `register.html`
  - `home.html`
  - `notes.html`
  - `profile.html`
- `/src/components`
  - `tabbar.html`
  - `navbar.html`
  - `note-card.html`

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
- **Alpine.js bindings:**  Data binding, forms data   
- **jQuery:** only for DOM manipulation, animations, or legacy plugins. Do not break Alpine bindings.  
- Mobile-first, responsive, clean typography, drop shadows, gradients, vibrant palette.  
- Placeholder images allowed; iconography from Onsen UI or third-party sets.  
- ⚠️ Beware to not break Alpine data binding 
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








