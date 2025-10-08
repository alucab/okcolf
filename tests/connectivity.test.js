windows.Tests.register('Connectivity', {
  // Automated tests
  async testOnlineDetection() {
    console.assert(typeof navigator.onLine === 'boolean');
    console.log(`✅ Online: ${navigator.onLine}`);
  },

  async testAppStateSync() {
    const store = Alpine.store('appState');
    console.assert(store.isApplicationConnected === navigator.onLine);
    console.log('✅ appState synced');
  },

  async testOfflineSession() {
    await KV.clear();
    window.dispatchEvent(new Event('offline'));
    await new Promise(r => setTimeout(r, 100));
    await AuthService.saveSession('anon', '', false);
    const session = await AuthService.checkSession();
    console.assert(session !== null);
    console.log('✅ Session works offline');
    window.dispatchEvent(new Event('online'));
    await KV.clear();
  },

  async testDexieOffline() {
    const worker = {
      first_name: "Test",
      last_name: "Offline",
      date_of_birth: "1990-01-01",
      phone: "1234567890",
      email: "offline@test.com",
      last_updated: new Date().toISOString()
    };
    const id = await db.workers.add(worker);
    const retrieved = await db.workers.get(id);
    console.assert(retrieved.first_name === "Test");
    await db.workers.delete(id);
    console.log('✅ Dexie offline');
  },

  async runAll() {
    console.log('🌐 Connectivity Tests\n');
    await this.testOnlineDetection();
    await this.testAppStateSync();
    await this.testOfflineSession();
    await this.testDexieOffline();
    console.log('✅ Complete\n');
  },

  // Manual tests
  manual: {
    '1-offline-registration': {
      name: 'Register while offline',
      steps: [
        'await test.welcome()',
        'DevTools → Network → Offline',
        'Complete registration',
        'Mock OTP works',
        'Session saved',
        'Footer shows offline'
      ],
      async run() { await test.welcome(); }
    },

    '2-full-offline': {
      name: 'Full offline app',
      steps: [
        'Register online',
        'Reload',
        'DevTools → Offline',
        'Reload → loads from SW',
        'Navigation works',
        'Add worker → Dexie',
        'Online → icon updates'
      ],
      async run() { console.log('Manual - use DevTools'); }
    }
  }
});