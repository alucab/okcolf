async function syncWithServer() {
  if (!navigator.onLine) return;
  await addLog('sync', 'Sincronizzazione in corso...');

  try {
    const serverData = []; // simulazione pull dal server
    for (const w of serverData.workers || []) {
      const local = await db.workers.get(w.id);
      if (!local || new Date(w.last_updated) > new Date(local.last_updated)) {
        await db.workers.put(w);
      }
    }
    await addLog('sync', 'Pull completata');
  } catch (err) {
    await addLog('error', 'Errore pull: ' + err);
  }

  try {
    const unsyncedWorkers = await db.workers.toArray();
    await addLog('sync', 'Push completata (simulata)');
  } catch (err) {
    await addLog('error', 'Errore push: ' + err);
  }
}

async function triggerSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const reg = await navigator.serviceWorker.ready;
    try {
      await reg.sync.register('sync-data');
      await addLog('sync', 'Sync registrata per SW');
    } catch (err) {
      await addLog('error', 'Errore registrazione sync: ' + err);
    }
  } else {
    await syncWithServer();
  }
}
