# Use Case – Fase 1

## 📋 Indice dei casi d’uso

### UC0 Welcome e salvataggio email

|F|Def|OK |Code |Titolo|
|-|---|---|-----|---|
|1|[x]|[x]|UC0.1|Registration / First Access with GAS|
|2|[x]|[ ]|UC0.2|Privacy Mgmt GDPR|
|2|[ ]|[ ]|UC0.3|Servizio serio OTP & Mailing|

### UC1 – Onboarding e prima configurazione

|F|Def|OK |Code |Titolo|
|-|---|---|-----|---|
|1|[x]|[ ]|UC1.1|Onboarding rapido collaboratore|
|1|[ ]|[ ]|UC1.2|Configurazione Datore (opzionale)|

### UC2 – Tracking & Reporting
|F|Def|OK |Code |Titolo|
|-|---|---|-----|---|
|1|[x]|[ ]|UC2.2|Tracking ore giornaliere / settimanali|
|1|[x]|[ ]|UC2.3|Schermata simulazione costi|
|1|[x]|[ ]|UC2.5|Reminder trimestrale simulato|

### UC6 Settings
|F|Def|OK |Code |Titolo|
|-|---|---|-----|---|
|1|[x]|[ ]|UC6.1|Suggerisci nuova funzione|
|1|[ ]|[ ]|UC6.2|Inserimento email da Settings|
|?|[ ]|[ ]|UC6.3|Reset dei Dati|
|?|[x]|[ ]|UC6.4|Export / Backup dati|

### UC7 Use case tecnici Vari
|F|Def|OK |Code |Titolo|
|-|---|---|-----|---|
|1|[ ]|[ ]|UC7.1|Update dell'applicazione senza cambia allo schema|
|1|[ ]|[ ]|UC7.2|Update del DB schema e migrazione|
|1|[ ]|[ ]|UC7.3|Analytics MVP|

---

## UC1.1 – Onboarding rapido collaboratore

### Metadati

* ID: UC1.1
* Nome: Onboarding rapido collaboratore
* Priorità: Alta
* Versione: 1.0
* Stato: Definito
* Ultima revisione: 2025-10-12

### Scopo strategico

Fidelizzazione iniziale e raccolta contatto.

### Priorità / MVP

Alta

### Schermate

* Spiegazione rapida (“Registra le ore del tuo collaboratore in pochi secondi al giorno”)
* Inserimento collaboratore + ore / retribuzione
* Riepilogo totale + messaggio soft “Vuoi salvare i dati e ricevere promemoria? → email opzionale”

### Attori

* Utente
* App
* Sistema Email (opzionale)

### Input

* Nome collaboratore
* Ore lavorate
* Retribuzione

### Output

* Totale mensile stimato
* Riepilogo dati inseriti

### Trigger e Ganci

* Export CSV → acquisizione contatto email opzionale
* Reminder trimestrale simulato

### Precondizioni

* App aperta
* Connessione internet (opzionale per export)

### Flusso principale

1. L’utente apre l’app.
2. Viene mostrata la schermata introduttiva.
3. Inserisce collaboratore, ore e retribuzione.
4. L’app calcola totale mensile e propone salvataggio con email opzionale.

### Flussi alternativi

* Nessuna email fornita → dati salvati solo localmente.
* Connessione assente → export disabilitato temporaneamente.

### Postcondizioni

* Dati visibili offline.
* Export possibile con email.

### Dati coinvolti

* `workers`
* `contracts`
* `kv` (profilo utente base)

### Analytics

* % utenti che completano onboarding
* Numero collaboratori inseriti
* Prima interazione con export / reminder

---

## UC2.2 – Tracking ore giornaliere / settimanali

### Metadati

* ID: UC2.2
* Nome: Tracking ore giornaliere / settimanali
* Priorità: Alta
* Versione: 1.0
* Stato: Definito
* Ultima revisione: 2025-10-12
  
### Scopo strategico

Retention e engagement quotidiano.

### Priorità / MVP

Alta

### Schermate

* Inserimento ore giornaliere / settimanali + marcatura ferie e malattia
* Riepilogo totale mensile
* Notifiche / reminder in-app

### Attori

* Utente
* App

### Input

* Ore giornaliere o settimanali

### Output

* Totale mensile aggiornato
* Avvisi reminder

### Trigger e Ganci

* Reminder “Hai X ore da registrare”
* Bottone “Simula costo totale”
* Bottone “Suggerisci nuova funzione”
* Export CSV / backup email

### Precondizioni

* Utente ha completato onboarding

### Flusso principale

1. L’utente apre la sezione “Ore”.
2. Inserisce ore giornaliere o settimanali.
3. L’app calcola totali e aggiorna il riepilogo mensile.

### Flussi alternativi

* Inserimento futuro → warning “Data non valida”.
* Connessione assente → reminder offline.

### Postcondizioni

* Totali aggiornati.
* Reminder attivi.

### Dati coinvolti

* `work_sessions`
* `contracts`
* `kv` (parametri reminder)

### Analytics

* Numero ore inserite
* Retention settimanale
* Click su export, simulazione, suggerimenti

---

## UC2.3 – Schermata simulazione costi

### Metadati

* ID: UC2.3
* Nome: Schermata simulazione costi
* Priorità: Alta
* Versione: 1.0
* Stato: Definito
* Ultima revisione: 2025-10-12

### Scopo strategico

Percezione del valore immediato + raccolta contatti.

### Priorità / MVP

Alta

### Schermate

* Simulazione costi: input ore / retribuzione / tipo collaboratore
* Tooltip info contributi stimati
* Popup CTA “Ricevi riepilogo via email”
* Opzione “Salva stima PDF”

### Attori

* Utente
* App
* Sistema Email (opzionale)

### Input

* Ore lavorate
* Retribuzione
* Tipo collaboratore

### Output

* Netto collaboratore
* Contributi stimati
* TFR
* Tredicesima
* Costo totale

### Trigger e Ganci

* CTA email → micro-email acquisition
* Salva PDF → gancio email

### Precondizioni

* Dati collaboratore inseriti

### Flusso principale

1. L’utente apre “Simulazione costi”.
2. Inserisce parametri e visualizza il calcolo.
3. Può esportare PDF o richiedere invio via email.

### Flussi alternativi

* Dati mancanti → avviso di completamento necessario.
* Email non fornita → salvataggio solo locale.

### Postcondizioni

* Visualizzazione offline possibile.
* Export PDF/email se abilitato.

### Dati coinvolti

* `contracts`
* `work_sessions`
* `payments` (simulazioni temporanee)

### Analytics

* % utenti che aprono simulazione
* Click CTA email
* Interazioni tooltip

---

## UC6.4 – Export / Backup dati

### Metadati

* ID: UC4
* Nome: Export / Backup dati
* Priorità: Media
* Versione: 1.0
* Stato: Definito
* Ultima revisione: 2025-10-12

### Scopo strategico

Raccolta contatti e fidelizzazione tramite sicurezza dati.

### Priorità / MVP

Media

### Schermate

* Bottone “Esporta CSV / Excel”
* Popup conferma export / inserimento email

### Attori

* Utente
* App
* Sistema Email

### Input

* Richiesta export

### Output

* CSV o Excel inviato via email / scaricato

### Trigger e Ganci

* Backup cloud → richiede email

### Precondizioni

* Dati presenti

### Flusso principale

1. L’utente preme “Esporta dati”.
2. L’app genera CSV/Excel.
3. L’utente può scaricarlo o inviarlo via email.

### Flussi alternativi

* Connessione assente → export locale solo CSV.
* Email mancante → opzione “Scarica solo”.

### Postcondizioni

* Dati salvati offline o cloud.

### Dati coinvolti

* Tutte le tabelle (`workers`, `contracts`, `work_sessions`, `payments`)

### Analytics

* % utenti che lasciano email
* Open/click reminder
* Conversione export → account Fase 2

---

## UC2.5 – Reminder trimestrale simulato

### Metadati

* ID: UC5
* Nome: Reminder trimestrale simulato
* Priorità: Media
* Versione: 1.0
* Stato: Definito
* Ultima revisione: 2025-10-12

### Scopo strategico

Engagement post-onboarding e micro-email acquisition.

### Priorità / MVP

Media

### Schermate

* Riepilogo trimestrale contributi stimati
* Popup CTA “Ricevi promemoria via email”
* Popup “Vuoi salvare dati sul cloud?”

### Attori

* Utente
* App
* Sistema Email

### Input

* NA

### Output

* Riepilogo trimestrale + CTA email

### Trigger e Ganci

* CTA email / salvataggio cloud

### Precondizioni

* Utente ha completato almeno un ciclo di inserimento dati

### Flusso principale

1. L’utente apre la sezione “Riepilogo trimestrale”.
2. L’app mostra importi stimati e scadenze.
3. Popup CTA invita a ricevere reminder via email.

### Flussi alternativi

* Nessuna email fornita → reminder solo locale.
* Connessione assente → reminder differito.

### Postcondizioni

* Reminder attivato
* Possibile ritorno app

### Dati coinvolti

* `work_sessions`
* `contracts`
* `payments`

### Analytics

* Click CTA
* Email inserite
* Ritorno nell’app

---

## UC6.1 – Suggerisci nuova funzione

### Metadati

* ID: UC6.1
* Nome: Suggerisci nuova funzione
* Priorità: Bassa
* Versione: 1.0
* Stato: Definito
* Ultima revisione: 2025-10-12

### Scopo strategico

Insight qualitativi, micro-email acquisition, engagement.

### Priorità / MVP

Bassa

### Schermate

* Popup campo testo libero descrizione feature
* Checkbox “Posso contattarti via email”
* Messaggio ringraziamento post-invio

### Attori

* Utente
* App
* Sistema Email (opzionale)

### Input

* Descrizione feature
* Checkbox consenso email

### Output

* Insight qualitativi raccolti
* Eventuale email acquisita

### Trigger e Ganci

* Bottone discreto in app

### Precondizioni

* App aperta
* Utente loggato o anonimo

### Flusso principale

1. L’utente seleziona “Suggerisci nuova funzione”.
2. Compila testo e, se vuole, autorizza contatto email.
3. App registra feedback e mostra messaggio di ringraziamento.

### Flussi alternativi

* Nessun testo inserito → invio non disponibile.
* Connessione assente → salvataggio locale in coda.

### Postcondizioni

* Suggerimento registrato
* Eventuale contatto email acquisito

### Dati coinvolti

* `forms` (feedback utente)
* `kv` (consenso contatto)

### Analytics

* Numero suggerimenti
* % email
* Trend feature

---

## UC0.2 – Privacy Mgmt per GDPR

### Metadati

* ID: UC0.2
* Nome: Privacy Mgmt per GDPR
* Priorità: Media
* Versione: 1.0
* Stato: Definito
* Ultima revisione: 2025-10-12

### Scopo strategico

Garantire piena conformità al GDPR (Art. 13 e 6), consentendo all’utente di:

* conoscere in modo trasparente le finalità del trattamento
* acconsentire esplicitamente
* esercitare i propri diritti (accesso, export, cancellazione)

### Priorità / MVP

Media (inclusa solo parte consenso per MVP; export / delete in UC8)

### Schermate

* Impostazioni → Privacy
* Accordion “Informativa Privacy” (Version 3 GDPR)
* Checkbox di consenso (Option C)
* Sezione per esportazione o cancellazione dati personali

### Attori

* Datore (utente registrato o locale)
* Sistema

### Input

* Email utente
* Scelta checkbox di consenso (Option C)
* Eventuale richiesta di cancellazione o export dati

### Output

* Registrazione del consenso GDPR
* File JSON con dati utente (in caso di export)
* Cancellazione dati personali dal DB locale

### Trigger e Ganci

* Primo accesso dopo registrazione → richiesta consenso
* Accesso a Impostazioni → sezione Privacy
* Scadenza normativa o modifica informativa → richiesta nuovo consenso

### Precondizioni

* App installata e funzionante
* Utente registrato via email (UC0 completato)
* Versione aggiornata dell’informativa (Version 3 + Option C) disponibile

### Flusso principale

1. L’utente apre Impostazioni → Privacy.
2. Visualizza informativa completa (Version 3).
3. Seleziona la checkbox “Option C”.
4. Il sistema salva consenso con timestamp e versione.
5. L’utente può esportare o cancellare i propri dati.

### Flussi alternativi

* L’utente non accetta → funzioni che richiedono autenticazione bloccate.
* Versione informativa aggiornata → richiesta nuovo consenso.

### Postcondizioni

* Consenso archiviato localmente nel DB (`kv.privacy_consent = true`, data e versione).
* Possibilità di revoca o cancellazione completa dei dati.
* Audit log dell’azione salvato (`logs` table).

### Dati coinvolti

* `kv` → privacy_consent, versione, data
* `logs` → audit trail delle azioni
* `forms` → informativa attiva

### Analytics

* % utenti che visualizzano informativa completa
* % che forniscono consenso GDPR (Option C)
* % che richiedono export o cancellazione
* Versione informativa attiva per ciascun consenso

---
