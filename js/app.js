async function initApp() {
  // Check if user has a session
  const session = await AuthService.checkSession();
  
  const navigator = document.querySelector('#myNavigator');
  
  if (!session) {
    // New user → show welcome page
    navigator.resetToPage('html/welcome.html');
  } else {
    // Existing user → show main app
    navigator.resetToPage('splitter.html');
    
    // Update appState
    if (window.Alpine?.store('appState')) {
      Alpine.store('appState').isUserAnonymous = (session.mode === 'anon');
      Alpine.store('appState').userEmail = session.email;
    }
    
    // Continue with existing initialization
    addSampleWorker();
    listWorkers();
  }
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
    await addLog('data', 'Nessun worker trovato');
  } else if (workers.length < 10) {
    await addLog('data', 'Workers trovati: ' + workers.length);
  } else {
    await deleteWorkers();
  }
  return;
}