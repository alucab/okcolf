# Project Context – OK Colf App (Express)

**Type:** Progressive Web App (PWA), mobile-first, offline-first with optional backend sync.

---

## Stack
- UI: OnsenUI + Alpine.js  
- Utilities: jQuery (only if needed)  
- Offline storage: dexie.js (`db.js`)  
- Target: PWA (manifest + SW)  
---

## Rules & Conventions
- AI can modify HTML/CSS/JS, create new files, ensure linking.  
- Prefer ES Modules; jQuery only for complex DOM/legacy code.  
- Use modern JS (arrow functions, async/await, destructuring, optional chaining).  
- Fetch or $.ajax for network; backend abstracted in `api.js`.  
- Use **ISO 8601 strings** (`YYYY-MM-DD`) for storing dates.

---

## UI & UX
- **Core elements:** Onsen UI elements
- **Alpine.js bindings:**  Data binding, forms data   
- **jQuery:** only for DOM manipulation, animations, or legacy plugins. 
- Do not break Alpine bindings with jQuery
- Mobile-first, responsive, clean typography, drop shadows, gradients, vibrant palette.  
- Placeholder images allowed; iconography from Onsen UI or third-party sets.  

---

## Offline-first Strategy
- dexie.js for local data (`db.js`)   
- File saving ops abstracted to allow to change backend via `api.js`
- All backend ops via `api.js` for easy swapping
   
---

## Authentication
- no authentication

---

## Features
- Base scaffolding, manifest.json + Service Worker  
- Tabbar navigation (OnsenUI)  
- Offline CRUD as per blueprint.md (dexie.js)  
- Toasts, loaders, responsive UI  