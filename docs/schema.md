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


```js
db.version(1).stores({
  workers: "++id,first_name,last_name,date_of_birth,phone,email,last_updated",
  employers: "++id,name,phone,email,address,last_updated",
  contracts: "++id,worker_id,employer_id,start_date,end_date,hours_per_week,hourly_wage,last_updated",
  work_sessions: "++id,contract_id,date,hours_worked,notes,last_updated",
  payments: "++id,contract_id,date,amount,method,last_updated",
  logs: "++id,timestamp,type,message",
  kv: '&key',
  forms: '&id, updatedAt'
});
```
