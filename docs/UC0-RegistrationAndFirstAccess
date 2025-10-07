# 🧱 Use Case: `welcome.html` (login / primo accesso)

---

- [🧱 Use Case: `welcome.html` (login / primo accesso)](#-use-case-welcomehtml-login--primo-accesso)
  - [💡 Flusso Utente](#-flusso-utente)
  - [🪶 Linee guida UI](#-linee-guida-ui)
  - [📐 Layout generale della pagina](#-layout-generale-della-pagina)
  - [🧩 Struttura funzionale (step-by-step, ma nella stessa page)](#-struttura-funzionale-step-by-step-ma-nella-stessa-page)
    - [Header splash](#header-splash)
    - [Box informativo](#box-informativo)
    - [Form dinamico (Alpine.js)](#form-dinamico-alpinejs)
    - [Footer piccolo (opzionale)](#footer-piccolo-opzionale)
  - [⚙️ Flusso tecnico completo – “Registrazione e primo accesso” (UC0)](#️-flusso-tecnico-completo--registrazione-e-primo-accesso-uc0)
    - [1. Evento `DOMContentLoaded`](#1-evento-domcontentloaded)
    - [2. Controllo della sessione utente](#2-controllo-della-sessione-utente)
    - [3. Scelta pagina iniziale](#3-scelta-pagina-iniziale)
    - [4. Caricamento della pagina `welcome.html` (se nuovo utente)](#4-caricamento-della-pagina-welcomehtml-se-nuovo-utente)
    - [5. Persistenza della sessione](#5-persistenza-della-sessione)
    - [6. Navigazione verso la Home](#6-navigazione-verso-la-home)
    - [7. Avvii successivi](#7-avvii-successivi)
  - [🧩 Stack Tecnologico Riassuntivo](#-stack-tecnologico-riassuntivo)
  - [➡️ In sintesi](#️-in-sintesi)

---

## 💡 Flusso Utente

1. L’utente apre l’app → vede splash con testo e form.  
2. Inserisce nome e email → clicca **“Invia codice”**.  
3. Riceve OTP → il campo OTP appare sotto (transizione fluida).  
4. Inserisce codice → clicca **“Conferma”**.  
5. I dati vengono salvati in `db.kv` → redirezione a `home.html`.

---

## 🪶 Linee guida UI

| Elemento        | Scelta                                                                        |
| --------------- | ----------------------------------------------------------------------------- |
| **Layout**      | `<div class="center" style="max-width:320px;margin:auto;text-align:center;">` |
| **Colori**      | Sfondo neutro (es. bianco o grigio chiaro), logo colorato                     |
| **Tipografia**  | Titolo grande (`h2`), testo esplicativo piccolo e chiaro                      |
| **Bottoni**     | `<ons-button modifier="large">` con spazio verticale generoso                 |
| **Transizioni** | `x-show` per passare da form email a form OTP (nessun cambio pagina)          |

---

## 📐 Layout generale della pagina

Un’unica `<ons-page>` in stile **splash screen**, centrata verticalmente:

~~~js
/*
┌───────────────────────────┐
│     [Logo / Titolo]       │
│ Gestisci la tua colf...   │
│───────────────────────────│
│ [Spiegazione modalità]    │
│───────────────────────────│
│ [Nome]                    │
│ [Email]                   │
│ [Bottone: Invia Codice]   │
│───────────────────────────│
│ [OTP]                     │
│ [Bottone: Conferma]       │
└───────────────────────────┘
*/
~~~

---

## 🧩 Struttura funzionale (step-by-step, ma nella stessa page)

### Header splash

- **Logo o icona app**
- **Titolo grande:** `OK Colf`
- **Sottotitolo:** `Gestisci ore, paghe e contributi domestici`

### Box informativo

Breve testo che spiega:

> “Puoi usare l’app offline o registrarti con la tua email per salvare i dati.”

### Form dinamico (Alpine.js)

- **Step 1:** Nome + Email + `[Invia codice]`
- **Step 2:** Campo OTP + `[Conferma]`

### Footer piccolo (opzionale)

- Link **“Continua senza email” → modalità locale**

---

## ⚙️ Flusso tecnico completo – “Registrazione e primo accesso” (UC0)

### 1. Evento `DOMContentLoaded`

- Il browser ha caricato e costruito il DOM di `index.html`.
- Viene eseguito il listener definito in `app.js`.
- **OnsenUI** è già inizializzato, ma non ha ancora caricato alcuna pagina, perché nel `index.html` il tag `<ons-navigator>` **non** specifica `page="..."`.

**Tecnologie:**

- OnsenUI (per navigator)
- JavaScript vanilla (`DOMContentLoaded`) + wrapper definiti nel mio codice
- Dexie.js (per storage locale) usando wrapper KV

---

### 2. Controllo della sessione utente

- Il codice verifica la presenza di una sessione salvata nel database locale Dexie:
  - **Tabella:** `kv`
  - **Chiave:** `user_session`
  - **Valore tipico:**  
  
    ~~~js
    // Prima della scelta chiavi non esistenti
    // Controllare l'esistenza
    {

    }
    // Dopo la scelta
    { 
        user_session_mode: 'anon',
        user_email_verified : false
        user_email : ""
     }
    // oppure
    { 
        user_session_mode: 'email',
        user_email_verified : true
        user_email : "a@b"
    } 
    ~~~

- Se non trova nulla → **utente nuovo**  
- Se trova sessione valida → **utente già registrato o in modalità locale**

**Tecnologie:**

- Dexie.js (wrapper IndexedDB per gestione asincrona)  
- Promesse / `async-await`
- Creazione di un servizio di auth in services.js

---

### 3. Scelta pagina iniziale

- In base al risultato del controllo:
  - Se **nuovo utente** → `navigator.resetToPage('welcome.html')`
  - Se **sessione valida** → `navigator.resetToPage('home.html')`

> Nota: l’uso di `resetToPage()` evita che la pagina iniziale venga messa nello stack di navigazione (quindi non si torna indietro con “back”).

**Tecnologie:**

- OnsenUI Navigator API

---

### 4. Caricamento della pagina `welcome.html` (se nuovo utente)

- OnsenUI carica `welcome.html` e genera l'evento `init` per quella pagina.
- Dentro `welcome.html` è definito un componente **Alpine.js** che gestisce il flusso di registrazione:
  - Visualizzazione iniziale tipo splash
  - Campo **nome** + **email**
  - Invio email → richiesta OTP (tramite **EmailJS** o simulazione)
  - Inserimento OTP e validazione
  - Salvataggio della sessione in Dexie con KV wrapper. Le variabili sono appiattite
  - Opzionale Campo per inserire il Nome dell'Utente
  - Salvataggio dell'email in remoto
  - Navigazione verso `home.html`

**Tecnologie:**

- OnsenUI (layout e componenti UI)  
- Alpine.js (logica reattiva e gestione step)  
- EmailJS (invio OTP client-side, opzionale)  
- Dexie.js (scrittura sessione nel KV store)

---

### 5. Persistenza della sessione

- Dopo la registrazione o la scelta della modalità locale:
  - La pagina salva il profilo utente nel database Dexie.
  - Non serve alcun backend: tutti i dati restano nel browser.
  - L’app considera ora l’utente autenticato (locale o registrato).

**Tecnologie:**

- Dexie.js (`db.kv.put()`)

---

### 6. Navigazione verso la Home

- Dopo il salvataggio, l’app esegue:
  
  ~~~js
  navigator.resetToPage('home.html');
  ~~~

- OnsenUI carica la Home, esegue il suo evento `init`, e mostra il dashboard principale:
  - card per inserire il collaboratore (se non presente)

**Tecnologie:**

- OnsenUI (navigazione e rendering)  
- Alpine.js (componenti reattivi interni alla Home)  
- Dexie.js (lettura dati persistenti)

---

### 7. Avvii successivi

- Alla successiva apertura della PWA:
  - `DOMContentLoaded` esegue di nuovo il controllo sessione su Dexie.
  - Trovando la sessione salvata, salta la pagina di registrazione.
  - L’utente atterra direttamente sulla Home.
  - card per inserire il collaboratore (se non presente)
  - card per vedere il collaboratore(se presente)
  - scorciatoie per inserire ore, visualizzare busta paga, ecc.

**Tecnologie:**

- Service Worker (già attivo, garantisce caricamento offline)  
- Dexie.js (persistenza locale)  
- OnsenUI Navigator (reset automatico su Home)

---

## 🧩 Stack Tecnologico Riassuntivo

|                Componente | Tecnologia                | Funzione                                   |
| ------------------------: | ------------------------- | ------------------------------------------ |
|          UI e Navigazione | OnsenUI                   | Struttura pagine, navigator, bottoni, card |
|                Reattività | Alpine.js                 | Gestione stato (step, email, OTP)          |
|            Storage locale | Dexie.js (IndexedDB)      | Sessione utente, dati profilo e app        |
|     Invio OTP (opzionale) | EmailJS (client-side)     | Email gratuita senza backend               |
| Persistenza offline / PWA | Service Worker + manifest | Caching e installabilità                   |
|          Bootstrap logico | JS su `DOMContentLoaded`  | Selezione pagina iniziale                  |

---

## ➡️ In sintesi

- Appena il **DOM è pronto**, lo script controlla la sessione su Dexie.  
- Se la sessione è **assente**, mostra `welcome.html` (Alpine + Onsen) e gestisce **nome, email, OTP**.  
- Dopo validazione, salva la sessione su Dexie e chiama `navigator.resetToPage('home.html')`.  
- Alle aperture successive la PWA trova la sessione e atterra direttamente sulla Home.

---
