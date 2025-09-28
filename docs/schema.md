# Tabelle

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

## Ore Lavorate
{
  id: "ore_2025_09_27",
  colfId: "colf_001",
  data: "2025-09-27",
  ore: 3,
  ferie: false
}

## Busta Paga
{
  id: "busta_2025_09",
  colfId: "colf_001",
  mese: "2025-09",
  oreTotali: 80,
  lordo: 840.00,
  inps: 116.00,
  irpef: 84.00,
  netto: 640.00,
  pdfPath: "/pdfs/busta_2025_09.pdf"
}

## CUA
{
  id: "cua_2025",
  colfId: "colf_001",
  anno: 2025,
  oreTotali: 960,
  retribuzioneTotale: 10080.00,
  contributiTotali: 1392.00,
  pdfPath: "/pdfs/cua_2025.pdf"
}

## Datore di Lavoro
{
  id: "datore_001",
  nome: "Luca Barba",
  codiceFiscale: "BRBLCA...",
  indirizzo: "Via Roma 1",
  email: "luca@example.com"
}
