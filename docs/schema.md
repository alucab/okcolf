# Tabelle

## Datore di Lavoro
{
  id: "datore_001",
  nome: "Luca Barba",
  codiceFiscale: "BRBLCA...",
  indirizzo: "Via Roma 1",
  email: "luca@example.com"
}


## Collaboratore
{
  id: "colf_001",
  nome: "Maria Rossi",
  codiceFiscale: "RSSMRA...",
  retribuzione: {
    tipo: "netto" | "budget",
    valore: 8.00,
    lordoCalcolato: 10.50,
    inps: 1.45,
    irpef: 1.05
  },
  oreSettimanali: 20
}

## Contratto
{
  id: "ore_2025_09_27",
  datoreId : "datore_001"
  colfId: "colf_001",
  dataInizio: "2025-09-27",
  dataFine: "2025-09-29",
  retribuzioneLorda: "8.5"
  livelloContratto:"B"
  commenti:""
}
## Contributi
{
  id:""
  anno:2025
  periodo:1
  inizio:"2025-01-01",
  fine:"2025-03-31",
  settimane_lavorate:5,
  numero_ore: 234
  ammontare dovuto : 436
  full_period:false
  scadenza:"2025-04-10"
  pagato : true
  pagatoWhen : "2025-09-29",
  pagatoClick : "2025-09-29"
  
}

## CUA
{
  id: "cua_2025",
  colfId: "colf_001",
  anno: 2025,
  oreTotali: 960,
  retribuzioneTotale: 10080.00,
  contributiTotali: 1392.00,
}


