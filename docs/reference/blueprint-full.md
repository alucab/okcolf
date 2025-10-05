# Problema
Le famiglie italiane che impiegano collaboratori domestici a ore (colf, babysitter, ecc.) affrontano difficoltà nella gestione amministrativa: assunzione, tracciamento ore, calcolo buste paga, contributi INPS e obblighi fiscali come la Comunicazione Unica Annuale (CUA). Le soluzioni esistenti sono complesse, costose e non mobile-first.

# Approccio Strategico
Realizzare una Progressive Web App (PWA) semplice, economica e conforme alla normativa italiana, con:

Frontend Onsen UI per UX mobile-friendly
Persistenza locale (IndexedDB o LocalStorage)
Backend opzionale (PocketBase solo per sincronizzazione futura)
Modello freemium: funzionalità base gratuite, premium a €9,99/anno
Focus su un solo collaboratore a ore
UX semplificata e flussi guidati
Adattamento automatico alle normative annuali

# Allineamento Soluzione

- Conforme a INPS, IRPEF, CCNL
- Mobile-first, UX semplificata
- Prezzo competitivo
- Feature differenziante: modalità retribuzione semplificata
- Adattamento automatico alle normative annuali

# Narrative
Utente 1 – Maria: Vuole che la sua babysitter riceva €8 netti all’ora. L’app calcola automaticamente il lordo e i contributi.
Utente 2 – Luca: Vuole spendere al massimo €10/ora per la sua colf. L’app mostra quanto riceverà la collaboratrice.
Edge Case: L’utente dimentica di registrare ore per una settimana. L’app lo avvisa e consente l’inserimento retroattivo.

# Obiettivi
## Metriche

- 1.000 utenti attivi in 3 mesi
- 10% conversione a premium
- 80% soddisfazione utente
- 100% conformità legale (INPS/CUA)

## Modello di Impatto

- Ricavi: 1.000 utenti premium × €9,99 = €9.990/anno
- Costi: VPS (€120), legale (€2.000), marketing (€2.000)
- Break-even: ~1.000 utenti premium

# Funzionalità Chiave

Autenticazione email/password (con salvatggio sessione per accesso continuo)
Persistenza locale (sql.js salvato periodicamente in indexed db)

- Onboarding e configurazione iniziale
  - Configurazione iniziale di base (esempio: dati della famiglia, IBAN per pagamenti, ecc.).
  - Gestione profilo datore di lavoro (inserimento/edit)
  - Gestione collaboratore(assunzione/editing) 
  - Selezione del tipo di collaboratore (esempio: pulizie, babysitter) per personalizzare le regole di contratto.
  - Wizard per l’assunzione → Domande guidate per compilare il contratto (esempio: durata, orario settimanale, retribuzione, ecc.).
  - Modalità retribuzione semplificata:
    - Netto desiderato
    - Budget massimo datore
    - Classica definizione del lordo
  
- Tracciamento ore settimanali e attività
  - Inserimento automatico o manuale delle ore → Opzione per segnare le ore lavorate giornalmente o settimanalmente.
  - Calcolo automatico degli straordinari e delle maggiorazioni (esempio: lavoro festivo).
  - Notifiche per ricordare di inserire le ore.
  - Gestione ferie e permessi con tracciamento del saldo.
- Variazioni contrattuali e cessazione rapporto
  - Modifica orario e stipendio con effetto retroattivo o da data specifica.
  - Wizard per il licenziamento → Calcolo automatico del preavviso e liquidazione finale (TFR, ferie non godute).
  - Comunicazione automatizzata all'INPS (se possibile via API o generando il modulo precompilato).

Documenti
- Lettera assunzione : Calcolo e Generazione PDF (premium)
- Busta paga : Calcolo e Generazione PDF (premium)
- CUA annuale : Calcolo e Generazione PDF (premium)
- Terminazione : Calcolo e Generazione PDF (premium)

# Future

- Variazioni del contratto
- Gestione multi-colf
- Notifiche push
- Social auth attivo
- Multilingua
- Gestione badanti/conviventi
- Firma digitale
- Archivio 24 mesi
- Sincronizzazione cloud
- Notifiche push per scadenze (esempio: versamento contributi, rinnovo contratto).
- Alert per straordinari o ferie in eccesso.
- Auto-aggiornamento dei contratti e retribuzioni in base ai rinnovi del CCNL.
- Integrazione con pagamenti: Collegamento a sistemi di pagamento (esempio: PayPal, bonifico SEPA) per pagare direttamente dallo smartphone.
- Dashboard e reportistica
  - Dashboard mensile → Riepilogo di costi, ore, contributi e ferie.
  - Previsione costi → Simulazione degli stipendi e contributi futuri in base a variazioni.
  - Esportazione dati → In PDF o CSV per dichiarazione dei redditi o archiviazione.
  
# Flussi Utente
## 🔐 Autenticazione (opzionale)

Registrazione → Verifica email → Login → “Ricordami” → Recupero password

## 👤 Profilo Datore

Inserimento dati anagrafici e fiscali → Salvataggio → Modifica

## 🧍‍♀️ Assunzione

Inserimento dati → Selezione modalità retribuzione → Scenario → Conferma → Generazione lettera PDF(Premium)

## 🧍‍♀️ Termine/Licenziamento

Inserimento dati → Conferma → Generazione lettera PDF(Premium)

## 💡 Modalità Retribuzione

Modalità 1: Inserisci netto orario → Calcolo scenario → Conferma
Modalità 2: Inserisci budget orario → Calcolo scenario → Conferma
Modalità 3: inserisci il lordo → Calcolo scenario → Conferma 

## 📅 Calendario

Selezione giorno → Inserimento ore → Salvataggio → Offline sync

## 💰 Busta Paga

Selezione mese → Calcolo → Visualizzazione → PDF (premium)

## 📄 CUA

Aggregazione annuale → Generazione PDF (premium)

## 📆 Annualità Normativa

Aggiornamento automatico tabelle → Adattamento calcoli → Notifica utente

## 🧭 Onboarding

3–5 schermate tutorial → Opzione “Salta” o “Rivedi più tardi”

## Logout


# Logiche Chiave

Calcolo busta paga: lordo, INPS, IRPEF, netto
Modalità retribuzione: input semplificato → scenario riepilogativo
Annualità: database tabelle normative aggiornabili per ogni anno

# Mappa di Navigazione
🏠 Home
  └─ Riepilogo collaboratore
  └─ Accesso rapido a ore, busta paga, CUA

👤 Profilo Datore
  └─ Dati anagrafici
  └─ Dati fiscali

🧍 Collaboratore
  └─ Inserimento dati
  └─ Modalità retribuzione
      └─ Netto desiderato
      └─ Budget massimo

📅 Calendario
  └─ Visualizzazione mensile
  └─ Inserimento ore
  └─ Ferie

💰 Busta Paga
  └─ Selezione mese
  └─ Calcolo
  └─ PDF (premium)

📄 CUA
  └─ Generazione annuale
  └─ PDF (premium)

⚙️ Impostazioni
  └─ Premium
  └─ Privacy
  └─ Reset dati