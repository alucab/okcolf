# COLF App Database Schema

## 1. Instructions and Notes for sql.js
- The database is designed for use with **sql.js** (SQLite compiled to WebAssembly/JavaScript).  
- All `INTEGER PRIMARY KEY` fields are **auto-incremented** by SQLite.  
- `FOREIGN KEY` constraints are included for clarity but **sql.js does not enforce them by default** unless explicitly enabled.  
- Use **ISO 8601 strings** (`YYYY-MM-DD`) for storing dates.  
- Use `TEXT` for fields that may vary in format (e.g., phone numbers, addresses).  
- Contractors (workers) can have **multiple contracts** with the same employer, to represent changes in working hours or salary over time.  

---

## 2. Schema Description (JSON-like format)

```json
{
  "workers": {
    "id": "INTEGER, primary key",
    "first_name": "TEXT, worker’s first name",
    "last_name": "TEXT, worker’s last name",
    "date_of_birth": "TEXT, date in YYYY-MM-DD format",
    "phone": "TEXT, contact phone",
    "email": "TEXT, optional email"
  },
  "employers": {
    "id": "INTEGER, primary key",
    "name": "TEXT, employer full name or company name",
    "phone": "TEXT, contact phone",
    "email": "TEXT, contact email",
    "address": "TEXT, address"
  },
  "contracts": {
    "id": "INTEGER, primary key",
    "worker_id": "INTEGER, foreign key → workers.id",
    "employer_id": "INTEGER, foreign key → employers.id",
    "start_date": "TEXT, contract start date",
    "end_date": "TEXT, contract end date (nullable if active)",
    "hours_per_week": "INTEGER, contracted hours per week",
    "hourly_wage": "REAL, wage per hour"
  },
  "work_sessions": {
    "id": "INTEGER, primary key",
    "contract_id": "INTEGER, foreign key → contracts.id",
    "date": "TEXT, session date",
    "hours_worked": "REAL, number of hours worked",
    "notes": "TEXT, optional notes"
  },
  "payments": {
    "id": "INTEGER, primary key",
    "contract_id": "INTEGER, foreign key → contracts.id",
    "date": "TEXT, payment date",
    "amount": "REAL, payment amount",
    "method": "TEXT, e.g., cash, bank transfer"
  }
}
```
---
## 2. SQL Script
```SQL
CREATE TABLE workers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT,
    phone TEXT,
    email TEXT
);

CREATE TABLE employers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT
);

CREATE TABLE contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    worker_id INTEGER NOT NULL,
    employer_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    hours_per_week INTEGER,
    hourly_wage REAL,
    FOREIGN KEY (worker_id) REFERENCES workers (id),
    FOREIGN KEY (employer_id) REFERENCES employers (id)
);

CREATE TABLE work_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    hours_worked REAL NOT NULL,
    notes TEXT,
    FOREIGN KEY (contract_id) REFERENCES contracts (id)
);

CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    amount REAL NOT NULL,
    method TEXT,
    FOREIGN KEY (contract_id) REFERENCES contracts (id)
);
```
