

function initApp() {
  addSampleWorker();
  listWorkers();
}

async function addSampleWorker() {
  const id = await db.workers.add({
    first_name: "Alice",
    last_name: "Rossi",
    date_of_birth: "1990-05-12",
    phone: "1234567890",
    email: "alice@example.com",
    last_updated: new Date().toISOString()
  });
  await addLog('data', `Worker ${id} aggiunto`);
  await triggerSync();
}

async function deleteWorkers() {
  await db.workers.clear();
  await addLog('data', 'Tutti i workers eliminati');
  await triggerSync();
}

async function listWorkers() {
  const workers = await db.workers.toArray();
  if (workers.length === 0) {
   // document.getElementById('workers-list').textContent = 'Nessun worker trovato.';
    await addLog('data', 'Nessun worker trovato');
  } else if (workers.length < 10) {
    await addLog('data', 'Workers trovati: ' + workers.length);
  //  document.getElementById('workers-list').textContent = JSON.stringify(workers, null, 2);
  } else {
  //  document.getElementById('workers-list').textContent = 'Troppi workers per essere mostrati (' + workers.length + ').';
    await deleteWorkers();
  }

  return;

}




