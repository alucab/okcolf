# Project Context – OK Colf App (Express)

**Type:** Progressive Web App (PWA), mobile-first, offline-first with optional backend sync.

---

## Stack
- UI: OnsenUI + Alpine.js  
- Utilities: jQuery (only if needed)  
- Offline storage: sql.js (`db.js`)  
- Backend: PocketBase (`api.js`)  
- Auth: Pocketbase  (`auth.js`)  
- Target: PWA (manifest + SW)  

---

## Structure
/public: index.html, manifest.json, service-worker.js, /icons
/src/css: main.css, variables.css
/src/js: app.js, db.js, api.js, state.js, ui.js
/src/views: login.html, register.html, home.html, notes.html, profile.html, etc.
/src/components: tabbar.html, navbar.html, note-card.html,etc.

---

## Rules & Conventions
- AI can modify HTML/CSS/JS, create new files, ensure linking.  
- Prefer ES Modules; jQuery only for complex DOM/legacy code.  
- Use modern JS (arrow functions, async/await, destructuring, optional chaining).  
- Fetch or $.ajax for network; backend abstracted in `api.js`.  

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
- SQL.js for local data (`db.js`)   
- File saving ops abstracted to allow to change backend via `api.js`
- All backend ops via `api.js` for easy swapping
   
---

## Authentication
- Pocketbase: Auth 
- All auth ops via `auth.js` for easy swapping
- Persistent sessions for auto-login

---

## Features
- Base scaffolding, manifest.json + Service Worker  
- Tabbar navigation (OnsenUI)  
- Login/logout & registration (Firebase)  
- Offline CRUD as per blueprint.md (sql.js)  
- Toasts, loaders, responsive UI  