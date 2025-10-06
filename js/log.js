async function addLog(type, message) {
  await db.logs.add({ timestamp: new Date().toISOString(), type, message });
  console.log(`[${type}] ${message}`);
}



