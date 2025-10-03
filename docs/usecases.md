# Use Case – Fase 1 (AI-Friendly)

## UC1 – Onboarding rapido collaboratore
- **Schermate:** 
  1. Spiegazione rapida (“Registra le ore del tuo collaboratore in pochi secondi al giorno”)  
  2. Inserimento collaboratore + ore/retribuzione  
  3. Riepilogo totale + messaggio soft “Vuoi salvare i dati e ricevere promemoria? → email opzionale”
- **Attori:** Utente, App, Sistema Email (opzionale)
- **Input:** Nome collaboratore, ore lavorate, retribuzione
- **Output:** Totale mensile stimato, riepilogo dati inseriti
- **Trigger/Ganci:** Export CSV → acquisizione contatto email opzionale, Reminder trimestrale simulato
- **Precondizioni:** App aperta, connessione internet opzionale per export
- **Postcondizioni:** Dati visibili offline, export possibile con email
- **Obiettivo strategico:** Fidelizzazione iniziale, raccolta contatto
- **Priorità MVP:** Alta
- **Analytics:** % utenti completamento onboarding, numero collaboratori inseriti, prima interazione con export/reminder

---

## UC2 – Tracking ore giornaliere / settimanali
- **Schermate:** 
  1. Inserimento ore giornaliere/settimanali  + marcatura giorni ferie e malattia
  2. Riepilogo totale mensile  
  3. Notifiche / reminder in-app
- **Attori:** Utente, App
- **Input:** Ore giornaliere o settimanali
- **Output:** Totale mensile aggiornato, avvisi reminder
- **Trigger/Ganci:** Reminder in-app “Hai X ore da registrare”, Bottone “Simula costo totale”, Bottone “Suggerisci nuova funzione”, Export CSV / backup email
- **Precondizioni:** Utente ha completato onboarding
- **Postcondizioni:** Totali aggiornati in app, reminder attivi
- **Obiettivo strategico:** Retention, engagement quotidiano
- **Priorità MVP:** Alta
- **Analytics:** Numero ore inserite, retention settimanale, click su export, simulazione e suggerimenti

---

## UC3 – Schermata simulazione costi
- **Schermate:** 
  1. Simulazione costi input ore/retribuzione/tipo collaboratore  
  2. Tooltip/info dettagliata sui contributi stimati  
  3. Popup CTA “Ricevi riepilogo via email”  
  4. Opzione “Salva stima PDF”
- **Attori:** Utente, App, Sistema Email (opzionale)
- **Input:** Ore lavorate, retribuzione, tipo collaboratore
- **Output:** Netto collaboratore, contributi stimati, TFR, tredicesima, costo totale
- **Trigger/Ganci:** CTA email → micro-email acquisition, Salva PDF → gancio email
- **Precondizioni:** Dati collaboratore inseriti
- **Postcondizioni:** Visualizzazione offline possibile, export PDF/email se abilitato
- **Obiettivo strategico:** Percezione valore immediato + raccolta contatti
- **Priorità MVP:** Alta
- **Analytics:** % utenti che aprono simulazione, click CTA email, interazioni tooltip

---

## UC4 – Export / Backup dati
- **Schermate:** 
  1. Bottone “Esporta CSV/Excel”  
  2. Popup conferma export / inserimento email
- **Attori:** Utente, App, Sistema Email
- **Input:** Richiesta export
- **Output:** CSV o Excel inviato via email / scaricato
- **Trigger/Ganci:** Backup cloud → richiede email
- **Precondizioni:** Dati presenti
- **Postcondizioni:** Dati salvati offline o cloud
- **Obiettivo strategico:** Raccolta contatti, fidelizzazione tramite sicurezza dati
- **Priorità MVP:** Media
- **Analytics:** % utenti che lasciano email, open/click reminder, conversione export → account Fase 2

---

## UC5 – Reminder trimestrale simulato
- **Schermate:** 
  1. Riepilogo trimestrale contributi stimati  
  2. Popup CTA “Ricevi promemoria via email”  
  3. Popup “Vuoi salvare dati sul cloud?”
- **Attori:** Utente, App, Sistema Email
- **Input:** Nessuno specifico (dati esistenti)
- **Output:** Riepilogo trimestrale + CTA email
- **Trigger/Ganci:** CTA email / salvataggio cloud
- **Precondizioni:** Utente ha completato almeno un ciclo di inserimento dati
- **Postcondizioni:** Reminder attivato, possibile ritorno app
- **Obiettivo strategico:** Engagement post-onboarding, micro-email acquisition
- **Priorità MVP:** Media
- **Analytics:** Click CTA, email inserite, ritorno nell’app

---

## UC6 – Suggerisci nuova funzione
- **Schermate:** 
  1. Popup campo testo libero descrizione feature  
  2. Checkbox “Posso contattarti via email”  
  3. Messaggio ringraziamento post-invio
- **Attori:** Utente, App, Sistema Email (opzionale)
- **Input:** Descrizione feature, checkbox consenso email
- **Output:** Insight qualitativi raccolti, eventuale email acquisita
- **Trigger/Ganci:** Bottone discreto in app
- **Precondizioni:** App aperta, utente loggato o anonimo
- **Postcondizioni:** Suggerimento registrato, eventuale contatto email acquisito
- **Obiettivo strategico:** Insight qualitativi, micro-email acquisition, engagement
- **Priorità MVP:** Bassa
- **Analytics:** Numero suggerimenti, % email, trend feature
