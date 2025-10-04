// App logic.
window.myApp = {};

document.addEventListener('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.


  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.

});

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

async function listWorkers() {
  const workers = await db.workers.toArray();
  document.getElementById('workers-list').textContent = JSON.stringify(workers, null, 2);
}

addSampleWorker();
listWorkers();


