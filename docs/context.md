# Project Context – OK Colf App (Express)

**Type:** Progressive Web App (PWA), mobile-first, offline-first with optional backend sync.

---

## Project Structure

/
├── index.html                         (pagina principale dell’app PWA basata su Onsen UI e Alpine.js)
├── manifest.json                      (configurazione della PWA: nome, icone, colori)
├── favicon.ico                        (icona del sito)
├── service-worker.js                  (gestione cache, aggiornamenti e modalità offline)
│
├── /assets                            (icone e immagini per PWA e social)
│   ├── apple-touch-icon.png           (icona per dispositivi iOS)
│   ├── maskable_icon.png              (icona PWA adattiva per Android)
│   ├── maskable_icon_x512.png         (versione ad alta risoluzione dell’icona PWA)
│   └── share.jpg                      (immagine di anteprima per la condivisione sui social)
│
├── /css                               (fogli di stile personalizzati)
│   └── main.css                       (stile principale dell’app, estende OnsenUI e Ionicons)
│
├── /js                                (logica applicativa e gestione dati locali/offline)
│   ├── utils.js                       (funzioni di utilità e helper globali)
│   ├── db.js                          (gestione database locale con Dexie.js)
│   ├── conf.js                        (configurazioni globali dell’applicazione)
│   ├── log.js                         (gestione logging e messaggi di debug)
│   ├── sync.js                        (sincronizzazione dati locale/remoto in modalità offline-first)
│   ├── services.js                    (servizi applicativi e logica di business)
│   ├── controllers.js                 (controllori delle viste Onsen e gestione interazioni)
│   └── app.js                         (punto d’ingresso JS, inizializzazione e stato globale)
│
└── /html                              (pagine modulari caricate dinamicamente dal tabbar)
    ├── datore.html                    (profilo del datore di lavoro)
    ├── collaboratore.html             (schede e gestione collaboratori)
    ├── ore.html                       (inserimento e gestione ore/assenze)
    ├── calendario.html                (vista calendario e pianificazione)
    ├── busta.html                     (visualizzazione e calcolo buste paga)
    ├── contributi.html                (prospetti contributivi INPS/IRPEF)
    ├── welcome.html                   (pagina di registrazione)
    └── settings.html                  (impostazioni utente e configurazione app)


server                                  (cntains the server component)

### 🧩 Tech Stack

- **UI:** Onsen UI + Ionicons + Google Fonts (Inter, Poppins) + custom CSS  
- **Reattività:** Alpine.js  
- **Storage offline:** Dexie.js (IndexedDB wrapper)  
- **App logic:** Vanilla JS (moduli: utils, db, conf, log, sync, services, controllers, app)  
- **PWA:** manifest.json + service-worker.js (offline-first, caching, update)  

---

## Rules & Conventions

- AI can modify HTML/CSS/JS, create new files, ensure linking.  
- Prefer ES Modules; jQuery only for complex DOM/legacy code.  
- Use modern JS (arrow functions, async/await, destructuring, optional chaining).  
- Fetch or $.ajax for network; backend abstracted in `api.js`.  
- Use **ISO 8601 strings** (`YYYY-MM-DD`) for storing dates.
- No JQuery but use the wrappers in utils.js to reduce the amount of code

---

## UI & UX

- **Core elements:** Onsen UI elements
- **Alpine.js bindings:**  Data binding, forms data
- Do not break Alpine bindings with jQuery
- Mobile-first, responsive, clean typography, drop shadows, gradients, vibrant palette.  
- Placeholder images allowed; iconography from Onsen UI or third-party sets.  

---

## Offline-first Strategy

- dexie.js for local data (`db.js`)
- File saving ops abstracted to allow to change backend via `api.js`
- All backend ops via `api.js` for easy swapping

---
