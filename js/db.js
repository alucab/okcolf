const db = new Dexie("WorkersDB");

db.version(1).stores({
  workers: "++id,first_name,last_name,date_of_birth,phone,email,last_updated",
  employers: "++id,name,phone,email,address,last_updated",
  contracts: "++id,worker_id,employer_id,start_date,end_date,hours_per_week,hourly_wage,last_updated",
  work_sessions: "++id,contract_id,date,hours_worked,notes,last_updated",
  payments: "++id,contract_id,date,amount,method,last_updated",
  logs: "++id,timestamp,type,message"
});
