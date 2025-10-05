# Blueprint – OK Colf PWA

## 1. Problema  
Le famiglie italiane che impiegano collaboratori domestici a ore (colf, babysitter, ecc.) affrontano difficoltà nella gestione amministrativa:  
- Assunzione e compilazione contratto  
- Tracciamento ore lavorate  
- Calcolo buste paga  
- Contributi INPS  
- Obblighi fiscali (es. Comunicazione Unica Annuale – CUA)  

Le soluzioni esistenti sono complesse, costose e non mobile-first.  

---

## 2. Approccio Strategico  
- Progressive Web App (PWA) semplice, economica e conforme alla normativa italiana  
- Modello freemium: funzionalità base gratuite, premium a €9,99/anno in futuro  
- Focus su **un solo collaboratore a ore** (no badanti conviventi, no casi complessi)  
- UX semplificata e flussi guidati  
- Adattamento automatico alle normative annuali  

---

## 3. Allineamento Normativo  

| Obbligo / Regola | Copertura nell’app |
|------------------|--------------------|
| INPS contributi  | Tabelle contributive annuali aggiornabili |
| IRPEF            | Calcolo base ritenute e netto da lordo |
| CCNL Colf        | Tabelle minimi contrattuali per categoria (pulizie, babysitter) |
| Annualità        | Database aggiornabile → calcoli sempre aggiornati |
| Trasparenza      | Scenari chiari per netto, lordo e budget massimo |

---

## 4. Narrative d’Uso  

- **Maria (Babysitter)** → vuole che la babysitter riceva €8 netti/ora → l’app calcola lordo + contributi.  
- **Luca (Colf)** → vuole spendere massimo €10/ora → l’app mostra il netto per la collaboratrice.  
- **Utente Occasionale** → non inserisce ore ogni giorno, ma solo ore totali mensili → l’app consente inserimento retroattivo e calcola comunque.  
- **Edge Case** → l’utente dimentica di registrare ore per una settimana → reminder e recupero dati retroattivo.  

---

## 5. Obiettivi  

### Metriche di Successo  
- **1.000 utenti attivi** in 3 mesi (registrati con email)  
- **80% soddisfazione utente** (survey in-app)  
- **70% utenti che inseriscono ore regolarmente** (leading metric)  
- **50% utenti che simulano busta paga almeno 2 volte**  

### Modello di Impatto  
- Versione gratuita come MVP  
- Premium in futuro con documenti e funzioni avanzate  

---

## 6. MVP Feature Set  

| Funzione | Scopo per l’utente | Stato |
|----------|-------------------|-------|
| Onboarding datore | Configurazione profilo fiscale | MVP |
| Onboarding collaboratore | Inserimento contratto guidato | MVP |
| Modalità retribuzione (Netto, Budget, Lordo) | Calcolo semplificato scenario | MVP |
| Tracking ore (giornaliere/settimanali/mensili) | Inserire lavoro svolto | MVP |
| Reminder inserimento ore | Non dimenticare registrazioni | MVP |
| Ferie e permessi | Tracciamento saldo | MVP |
| Calcolo busta paga (lordo, INPS, IRPEF, netto) | Trasparenza costi | MVP |
| Proiezioni TFR e 13ª | Visione futura | MVP |
| Reminder contributi trimestrali | Aiuto sugli obblighi | MVP |
| Export / Backup dati | Sicurezza dati | MVP |
| Suggerisci nuova funzione | Coinvolgimento utenti | MVP |

---

## 7. Stack Tecnico  

- **Target**: PWA (manifest + service worker), mobile-first  
- **UI**: OnsenUI + Alpine.js  
- **Utilities**: jQuery (solo se necessario)  
- **Offline storage**: Dexie.js (IndexedDB wrapper `db.js`)  
- **Persistenza & Update**: migrazione schema automatica + update dati se cambia normativa  
- **Deployment**: GitHub Pages / Cloudflare Pages (iniziale) → futura valutazione Vercel  
- **Testing**: manuale per MVP, con possibilità di aggiungere unit test JS  

---

## 8. Use Cases  

# Use Cases Core/MVP

## UC0 – Registrazione e Primo Accesso
**Priorità:** Core  
**Attori:** Datore  
**Precondizioni:** Utente non autenticato  
**Flusso principale:**
1. L’utente apre l’app per la prima volta.
2. L’app propone due opzioni: *Modalità locale* o *Registrazione via email*.
3. In caso di registrazione, l’utente inserisce email → riceve OTP → valida account.
4. Sessione salvata localmente.
**Flussi alternativi:** Email non valida / OTP scaduto → errore con retry.  
**Dati coinvolti:** `User`  
**Acceptance criteria:** Utente può scegliere modalità locale o registrazione via email; sessione persistente.

---

## UC1 – Configurazione Collaboratore (Contratto Iniziale)
**Priorità:** Core  
**Attori:** Datore  
**Precondizioni:** Utente autenticato (locale o registrato)  
**Flusso principale:**
1. L’utente crea un nuovo collaboratore.
2. Inserisce dati anagrafici (nome, CF, IBAN).
3. Selezione tipo collaboratore (pulizie, babysitter) → regole CCNL 
4. Imposta parametri contratto (ore settimanali, paga oraria/mensile, contributi).
5. Modalità retribuzione (Netto / Budget massimo / Lordo)  
6. Salva contratto attivo.
7. Edit contratto → ripassa tutto il wizard  
**Flussi alternativi:** Dati mancanti o invalidi → warning (es. CF non valido).  
**Dati coinvolti:** `Collaborator`, `Contract`  
**Acceptance criteria:** Contratto valido e attivo salvato nel DB locale.

---

## UC2 – Inserimento Ore e Assenze
**Priorità:** Core  
**Attori:** Datore  
**Precondizioni:** Collaboratore attivo con contratto  
**Flusso principale:**
1. L’utente apre calendario.
2. Seleziona giorno → aggiunge ore lavorate o assenze (vacanza, malattia).
3. L’app calcola automaticamente ore totali settimana/mese.
4. Inserimento manuale o automatico (giornaliero/settimanale/mensile)  
5. Calcolo straordinari e festività  
6. Reminder inserimento ore  
7. Gestione ferie e saldo  
**Flussi alternativi:** Inserimento in giorno futuro → warning.  
**Dati coinvolti:** `TimesheetEntry`  
**Acceptance criteria:** Ogni giorno può contenere ore/assenze; calcoli aggiornati correttamente.

---

## UC3 – Visualizzazione Busta Paga
**Priorità:** Core  
**Attori:** Datore  
**Precondizioni:** 
- Collaboratore attivo con contratto valido
- Ore settimanali/mensili inserite nel sistema

**Flusso principale:**
1. L’utente seleziona “Busta Paga” dal menu principale.
2. Seleziona il mese di interesse.
3. L’app calcola automaticamente:
   - Stipendio lordo
   - Contributi INPS e IRPEF
   - Stipendio netto
   - Eventuali straordinari, maggiorazioni o bonus
4. L’app mostra la proiezione di TFR e 13ª mensilità.
5. Visualizzazione in modalità riepilogativa con possibilità di dettaglio per voce.

**Flussi alternativi:**
- Dati mancanti (ore o contratto incompleto) → messaggio “Dati insufficienti per il calcolo” e possibilità di inserimento retroattivo.
- Mese selezionato senza ore registrate → avviso e opzione di inserimento ore manuale.

**Dati coinvolti:** 
- `TimesheetEntry` (ore lavorate, straordinari)  
- `Contract` (tipo retribuzione, contributi)  
- `ContributionProposal` (calcolo INPS/IRPEF)

**Acceptance criteria:** 
- L’app mostra busta paga completa e coerente con i dati inseriti.
- Tutti i calcoli devono essere aggiornati in tempo reale.
- L’utente può esportare o salvare il riepilogo (PDF/JSON) per uso personale.
- Possibilità di consultare proiezioni annuali basate sulle ore inserite

---

## UC4 – Generazione Prospetto Contributivo
**Priorità:** Core  
**Attori:** Datore  
**Precondizioni:** Ore inserite nel mese  
**Flusso principale:**
1. L’utente seleziona “Calcola contributi”.
2. L’app genera prospetto INPS/IRPEF in base a contratto + ore.
3. Mostra importi da versare e scadenze.
**Flussi alternativi:** Contratto incompleto → errore “Dati insufficienti”.  
**Dati coinvolti:** `Contract`, `TimesheetEntry`, `ContributionProposal`  
**Acceptance criteria:** Prospetto numerico coerente salvato nel DB.

---

## UC6 – Backup e Ripristino Dati
**Priorità:** Core  
**Attori:** Datore  
**Precondizioni:** Dati salvati in DB locale  
**Flusso principale:**
1. L’utente apre Impostazioni → Backup.
2. App genera file `.json` crittografato.
3. Per ripristino, l’utente importa file valido.
**Flussi alternativi:** File corrotto → errore.  
**Dati coinvolti:** Tutte le entità  
**Acceptance criteria:** Export/import completati; dati ripristinati correttamente.

---

## UC8 – Privacy & GDPR (Export/Delete)
**Priorità:** Core  
**Attori:** Datore  
**Precondizioni:** Utente registrato o locale con dati  
**Flusso principale:**
1. L’utente accede a Impostazioni → Privacy.
2. Esporta dati in JSON.
3. Cancella account e dati locali se richiesto.
**Dati coinvolti:** Tutte le entità  
**Acceptance criteria:** Export e delete funzionano con conferma e undo temporaneo.

---

## UC9 – Reminder Configurabili
**Priorità:** Core  
**Attori:** Datore  
**Precondizioni:** App installata  
**Flusso principale:**
1. Utente apre Impostazioni → Notifiche.
2. Seleziona reminder (es. ore, contributi).
3. Imposta frequenza (giornaliera, settimanale, mensile).
4. App genera notifiche in base alla scelta.
**Dati coinvolti:** `ReminderSetting`  
**Acceptance criteria:** Reminder appaiono nei tempi configurati.

---

## UC10 – Validazione Dati Fiscali
**Priorità:** Core  
**Attori:** Sistema / Datore  
**Precondizioni:** Inserimento dati anagrafici/contrattuali  
**Flusso principale:**
1. L’utente inserisce dati (CF, IBAN, ecc.).
2. Il sistema valida formati e correttezza.
3. Se valido → consente salvataggio.
**Flussi alternativi:** Dati non validi → errore.  
**Dati coinvolti:** `Collaborator`, `Contract`  
**Acceptance criteria:** Nessun salvataggio possibile con dati invalidi.

---

## UC11 – Migrazione Schema Automatica
**Priorità:** Core  
**Attori:** Sistema  
**Precondizioni:** Aggiornamento app  
**Flusso principale:**
1. All’avvio, sistema rileva versione DB precedente.
2. Applica script migration incrementale.
3. Backup automatico prima della migration.
**Flussi alternativi:** Migration fallita → rollback.  
**Dati coinvolti:** Tutte le entità  
**Acceptance criteria:** Nessuna perdita dati tra versioni.

---

## UC12 – Audit Trail & Log Modifiche
**Priorità:** Core  
**Attori:** Sistema / Datore  
**Precondizioni:** Dati presenti  
**Flusso principale:**
1. Ogni modifica (ore, contratto, comunicazione) loggata con timestamp e autore.
2. Utente può visualizzare cronologia modifiche.
**Dati coinvolti:** `AuditLog` + entità di riferimento  
**Acceptance criteria:** Cronologia consultabile per tutte le modifiche.

---

## UC13 – Supporto & Feedback In-App
**Priorità:** Core  
**Attori:** Datore  
**Precondizioni:** App attiva  
**Flusso principale:**
1. Utente apre Impostazioni → Supporto.
2. Legge FAQ o invia feedback/bug report.
**Dati coinvolti:** `SupportMessage`  
**Acceptance criteria:** Feedback salvato localmente, pronto per futuro invio/log.


---

## 9. Mappa di Navigazione  

# 🗺️ Mappa Screen PWA – Core MVP

## 🏠 Home / Prima Connessione
- Benvenuto / Profilo breve dell'app
- invito a registrare l'email
- Bottone per skippare e andare in modalità offline completa
- Mark registered se l'utente si registra

## 🏠 Home / Dashboard principale
**Obiettivo:** Accesso rapido a funzioni core, riepiloghi e reminder
- **Benvenuto** → UC0, UC1
- **SE Day 0 allora solo wizard di configurazione**
- **Riepilogo collaboratore attivo** → ore lavorate, ferie residue, stipendio stimato → UC2, UC3
- **Shortcut principali (card o pulsanti):**
  - Inserimento ore → UC2
  - Visualizzazione busta paga → UC3
  - Prospetto contributi → UC4
- **Avvisi / Reminder** → ore non inserite, contributi in scadenza → UC9
- **Accesso rapido collaboratore (Day 0 / onboarding)** → UC1

---

## 📑 Menu laterale
**Funzioni secondarie / gestione dati**
- 👤 **Profilo Datore** → dati fiscali e anagrafici → UC0, UC10
- 🧍 **Collaboratore**
  - Dati anagrafici → UC1
  - Contratto → UC1
  - Modalità retribuzione → UC1
- 📅 **Calendario**
  - Inserimento ore giornaliere / settimanali → UC2
  - Ferie e permessi → UC2
  - Saldo ferie → UC2
- 💰 **Busta Paga**
  - Selezione mese → UC3
  - Calcolo e visualizzazione dettagli → UC3
- 💰 **Contributi**
  - Selezione trimestre → UC4
  - Calcolo prospetto INPS/IRPEF → UC4
- ⚙️ **Impostazioni**
  - Privacy → UC8
  - Reset dati → UC6
  - Export / Backup → UC6
  - Suggerimenti / Supporto → UC13

---

## ⬇️ Bottom navigation
**Accesso rapido alle funzioni più usate**
- 🏠 Home / Dashboard → UC0, UC1, UC2, UC3, UC9
- 📅 Inserimento Ore → UC2
- 💰 Busta Paga / Prospetto Contributivo → UC3, UC4 (opzionale)

---

## 💡 Note UX / Dashboard
- **Card dinamiche per collaboratore**: ore settimanali, stipendio netto, ferie residue → UC2, UC3
- **Mini grafici / indicatori avanzamento**: barre per ore lavorate, ferie, budget massimo speso → UC2, UC3
- **Shortcut dinamici** in base a stato utente:
  - Day 0 → onboarding UC0, UC1
  - Day N → inserimento ore UC2, visualizzazione busta paga UC3
  - EoQ → prospetto contributi UC4
- **Avvisi visivi / reminder integrati** → UC9
- **Accesso rapido documenti PDF** → UC3, UC4



---

## 10. Flussi Utente  

- **Profilo Datore** → inserimento dati anagrafici → salvataggio → modifica  
- **Collaboratore** → inserimento dati → modalità retribuzione → scenario → conferma  
- **Modalità Retribuzione**  
  - Netto orario → calcolo scenario → conferma  
  - Budget orario → calcolo scenario → conferma  
  - Lordo orario → calcolo scenario → conferma  
- **Inserimento ore** → selezione settimana → inserimento → salvataggio  
- **Busta paga** → selezione mese → calcolo → visualizzazione  
- **Annualità normativa** → aggiornamento tabelle → calcoli aggiornati → notifica utente  

---

## 11. NON OBIETTIVI (Future Roadmap)  

### Documenti (Premium)  
- Generazione PDF: Lettera assunzione, Busta paga, CUA annuale, Terminazione  

### Contratti e gestione multipla  
- Multi-colf  
- Variazioni contratto retroattive o con data specifica  
- Licenziamento con wizard (preavviso, TFR, ferie residue)  

### Automazione & notifiche  
- Push notification (scadenze contributi, rinnovi contratto, ferie eccessive)  
- Auto-aggiornamento CCNL  

### Integrazioni  
- Pagamenti diretti (PayPal, SEPA)  
- Social login, multilingua, firma digitale  

### Archiviazione & reportistica  
- Archivio 24 mesi  
- Dashboard costi mensili, simulazioni future  
- Export PDF/CSV  

### Cloud & Sync  
- Sincronizzazione cloud  
- Accesso multi-device  
