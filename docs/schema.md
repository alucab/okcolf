# COLF App Database Schema

## 0. Instructions and Notes
- The database is designed for use with **dexie.js**   
- Use **ISO 8601 strings** (`YYYY-MM-DD`) for storing dates.  
- Use `TEXT` for fields that may vary in format (e.g., phone numbers, addresses).  
- Contractors (workers) can have **multiple contracts** with the same employer, to represent changes in working hours or salary over time.  

---
## 1. Data structure to configure the application

### 1.1 Social security payments configuration

- this is a structure that is part of the application not the db
- it gives year by year and threshold by threshold the amount due per hour and the the start/end date of the social security payments

year:
  amounts : 
    paid_hour_threshold
      number_of_hours_threshold
        amount_due_per_hour
  quarters :
    quarter_number, start, end, deadline
}

```json
{
  "social_security_payments":{
    "id": "INTEGER, primary key",
    "contract_id": "INTEGER, foreign key → contracts.id",  
    "start_date": "TEXT, quarter start date",
    "end_date": "TEXT, quarter end date (nullable if active)",
    "quarter" :  "INTEGER",
    "year" :  "INTEGER",
    "number_of_weeks" : "INTEGER",
    "number_of_hours" : "INTEGER",
    "paid" : "BOOLEAN",
    "payment_date": "TEXT, contract start date",
  }
}
```

---

## 2. Data Schema Description (JSON-like format)

```json
{
  "workers": {
    "id": "INTEGER, primary key",
    "first_name": "TEXT, worker’s first name",
    "last_name": "TEXT, worker’s last name",
    "date_of_birth": "TEXT, date in YYYY-MM-DD format",
    "phone": "TEXT, contact phone",
    "email": "TEXT, optional email",
    "tax_code": "TEXT,compulsory"
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
    "contract_no": "TEXT,optional",
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
  },
  "social_security_payments":{
    "id": "INTEGER, primary key",
    "contract_id": "INTEGER, foreign key → contracts.id",  
    "start_date": "TEXT, quarter start date",
    "end_date": "TEXT, quarter end date (nullable if active)",
    "quarter" :  "INTEGER",
    "year" :  "INTEGER",
    "number_of_weeks" : "INTEGER",
    "number_of_hours" : "INTEGER",
    "paid" : "BOOLEAN",
    "payment_date": "TEXT, contract start date",
  }
}
```
