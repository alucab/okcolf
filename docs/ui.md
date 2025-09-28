1️⃣ Struttura logica della UI
A. Onboarding (Day 0)

Obiettivo: guidare l’utente passo passo senza distrazioni.

Full-screen wizard / stack di schermate:

Registrazione / Login → input minimo, chiaro, progress bar

Profilo famiglia → pochi campi, con tooltips brevi per IBAN, indirizzo

Inserimento collaboratore → nome, codice fiscale, tipo contratto

Wizard contratto → step 1-3 con progress bar

Riepilogo + Generazione PDF → bottone finale “Scarica / Invia PDF”

Menu laterale / hamburger menu: non presente all’inizio, per non distrarre

Call to Action principale: “Completa registrazione e genera contratto”

B. Daily Use (dopo onboarding)
Home Dashboard

Layout centrale semplice

Bottone principale al centro: Daily Tracking → per inserimento ore/ferie

Bottone grande, facilmente cliccabile, con icona chiara (“+ ore/ferie”)

Funzione più usata, quindi evidenziata

Secondary actions → in bottom tab / hamburger menu

Generazione busta paga → mensile

Calcolo contributi → dettagli INPS

Generazione CU → annuale

Modifica collaboratore / datore → impostazioni, accessibile ma nascosto, non in primo piano

Licenziamento → nascosto in menu “Altro” o impostazioni avanzate

Layout suggerito
┌─────────────────────────────┐
│ Header: logo / nome famiglia │
├─────────────────────────────┤
│                             │
│   [ Daily Tracking ]        │ ← bottone centrale principale
│                             │
├─────────────────────────────┤
│ Bottom menu / hamburger     │
│ - Busta paga                │
│ - Contributi                │
│ - CU                        │
│ - Impostazioni collaboratore│
│ - Licenziamento             │
└─────────────────────────────┘

C. Logica di accesso alle funzioni meno frequenti

Impostazioni collaboratore / datore → accesso solo dopo onboarding

Evitare confusione iniziale

Include modifica stipendio, ore, IBAN datore

Licenziamento → menu nascosto con conferma multipla

Evita errori accidentali

D. Flussi rapidi

Daily Tracking:

Tap → form rapido (giorno, ore, ferie) → conferma → PDF opzionale

Feedback immediato “Ore salvate”

Busta paga mensile:

Tap → anteprima PDF → download / invio email

CU annuale:

Tap → anteprima PDF → download / invio email

Modifica dati datore/collaboratore:

Tap menu → modifica → conferma → PDF aggiornato

Licenziamento:

Tap menu → wizard licenziamento → conferma multipla → PDF generato

E. Principi guida per l’UI

Priorità visiva: la funzione più usata (inserimento ore) al centro

Riduzione distrazioni: funzioni rare in menu secondario

Coerenza: tutte le generazioni PDF seguono lo stesso pattern (anteprima → conferma → download/email)

Chiarezza B2C: termini semplici, icone intuitive, progress bar per wizard

Feedback immediato: toast o alert per confermare azioni completate