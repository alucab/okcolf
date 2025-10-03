# MVP Lean – Gestione Comunicazione Unica

---

## 🟢 Caso 0 – Download e Registrazione
**Obiettivo:**  
Scaricare l’app, registrarsi e avere 
Per l'app raccogliere le email e costruire contatti devono fare opt-in al mailing per avere accesso

**Schermate principali:**
1. App Store Listing – Titolo, descrizione, screenshot
2. Permessi – Location, notifiche, storage
3. Opzioni registrazione – Apple, Google, Email
4. Form registrazione – Email, password, T&C, Privacy, Disclaimer
5. Verifica email – Magic link o OTP
6. Schermata di benvenuto – Messaggio di saluto e vantaggi principali
7. **Sessione persistente** – Auto-login al riavvio dell’app

---

## 🟢 Caso 1 – Assunzione Collaboratore/Inserimento Dati
**Obiettivo:**  
Inserire i dati del datore di lavoro e del lavoratore
Bare minimum per generare la CU e i contributi
Il contratto e' chiaramente a ore, senza convivenza, super semplice
In questo modello non puoi avere variazioni, in alternativa puoi scegliere di dire quante ore ha lavorato e a quale costo orario.

**Schermate principali:**
10. Profilo Datore di Lavoro – Nome, Indirizzo, Codice fiscale
11. Profilo collaboratore – Nome, Indirizzo, Codice fiscale
12. Gestione Contratto:
   - Step 1: Tipo contratto – CCNL colf, tempo determinato o indeterminato
   - Step 2: Ore lavorate – Totale e giorni
     - Opzione 1 : Struttura settimanale ore e giorni 
     - Opzione 2 : Numero di ore lavorate nell'anno
     - Opzione 3 : Lump Sum 
   - Step 3: Calcolo Retribuzione lorda 
     - Calcolo Retribuzione lorda : varie opzioni
     - Contributi INPS – Opzioni predefinite o manuali
   - Step 4: - Varie opzioni
13. Riepilogo contratto – Anteprima dei dati inseriti
14. Schermata successo – Conferma avvenuta

---

## 🟢 Caso 2 – Gestione contributi
**Obiettivo:**  
Visualizzare anteprima contributi INPS dovuti nell'anno divisi per quarti
Il calcolo avviene sino alla data attuale per consentire di gestire situazioni come licenziamento.
Vedi solo l'anno in corso non anni precedenti

**Schermate principali:**
31. Riepilogo contributi – Dettaglio INPS, quota datore, quota collaboratore
32. Conferma e gestione scadenze
33. Schermata successo

---

## 🟢 Caso 3 – Generazione CU (Certificazione Unica)
**Obiettivo:**  
Generare la CU annuale per il collaboratore.

**Schermate principali:**
34. Riepilogo CU – Salario annuale, tasse, contributi
35. Conferma e genera PDF – Download o invio email
36. Schermata successo – PDF pronto e notificato

---

## 🟢 Caso 4 – Licenziamento/Blocco Rapporto
**Obiettivo:**  
Gestire la cessazione del contratto bloccando calcolo contributi e CU

**Schermate principali:**
16. Wizard licenziamento:
   - Step 1: Data fine contratto – con alert preavviso
   - Step 2: Blocco Calcolo Contributi
   - Step 3: Template Lettera
17. Riepilogo licenziamento – Anteprima dei dati
18. Schermata successo – Conferma avvenuta

---

## 🟢 Caso 5 – Accesso T&C
**Obiettivo:**  
Dare accesso ai documenti ed ai chiarimenti che governano l'app


**Schermate principali:**
1.  Sezione Informazioni:
- Privacy 
- GDPR
- T&C
- Manuale e Chiarimenti
---


