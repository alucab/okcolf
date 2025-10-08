/***********************************************************************
 * Centralized Test Suite for OK Colf Express
 ***********************************************************************/

window.Tests = {
  
  // Welcome Page Automated Tests
  WelcomePage: {
    async clearSession() {
      await KV.clear();
      console.log('✅ Session cleared');
    },

    async testSessionCheck() {
      await this.clearSession();
      const session = await AuthService.checkSession();
      console.assert(session === null, '❌ Should return null for new user');
      console.log('✅ 6.1.1: Session check works for new user');
    },

    async testAnonSession() {
      await AuthService.saveSession('anon', '', false);
      const session = await AuthService.checkSession();
      console.assert(session.mode === 'anon', '❌ Mode should be anon');
      console.assert(session.email === '', '❌ Email should be empty');
      console.assert(session.verified === false, '❌ Should not be verified');
      console.log('✅ 6.2: Anonymous session saves correctly');
      await this.clearSession();
    },

    async testEmailSession() {
      await AuthService.saveSession('email', 'test@example.com', true);
      const session = await AuthService.checkSession();
      console.assert(session.mode === 'email', '❌ Mode should be email');
      console.assert(session.email === 'test@example.com', '❌ Email mismatch');
      console.assert(session.verified === true, '❌ Should be verified');
      console.log('✅ 6.4: Email session persists correctly');
      await this.clearSession();
    },

    async testOTPSend() {
      const result = await AuthService.sendOTP('test@example.com');
      console.assert(result.success === true, '❌ OTP send should succeed');
      console.assert(result.code === '123456', '❌ Mock code should be 123456');
      console.log('✅ 6.1.2: Mock OTP sends correctly');
    },

    async testOTPVerify() {
      let result = await AuthService.verifyOTP('test@example.com', '123456');
      console.assert(result.success === true, '❌ Valid OTP should succeed');
      
      result = await AuthService.verifyOTP('test@example.com', '12345');
      console.assert(result.success === false, '❌ 5-digit code should fail');
      
      result = await AuthService.verifyOTP('test@example.com', 'abcdef');
      console.assert(result.success === false, '❌ Non-numeric should fail');
      
      console.log('✅ 6.6: OTP validation works');
    },

    async runAll() {
      console.log('🧪 Welcome Page Tests...\n');
      try {
        await this.testSessionCheck();
        await this.testAnonSession();
        await this.testEmailSession();
        await this.testOTPSend();
        await this.testOTPVerify();
        console.log('✅ All welcome page tests passed!\n');
      } catch (err) {
        console.error('❌ Test failed:', err);
      }
    }
  },

  // Connectivity Automated Tests
  Connectivity: {
    async testOnlineDetection() {
      const isOnline = navigator.onLine;
      console.assert(typeof isOnline === 'boolean', '❌ onLine should be boolean');
      console.log(`✅ Online detection: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);
      return isOnline;
    },

    async testAppStateSync() {
      const store = Alpine.store('appState');
      const actual = navigator.onLine;
      console.assert(store.isApplicationConnected === actual, '❌ appState not synced');
      console.log('✅ appState.isApplicationConnected synced');
    },

    async testOfflineSession() {
      await KV.clear();
      window.dispatchEvent(new Event('offline'));
      await new Promise(r => setTimeout(r, 100));
      
      await AuthService.saveSession('anon', '', false);
      const session = await AuthService.checkSession();
      console.assert(session !== null, '❌ Session should work offline');
      console.log('✅ Session operations work offline');
      
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
      console.assert(retrieved.first_name === "Test", '❌ DB write/read failed');
      await db.workers.delete(id);
      console.log('✅ Dexie operations work offline');
    },

    async runAll() {
      console.log('🌐 Connectivity Tests...\n');
      try {
        await this.testOnlineDetection();
        await this.testAppStateSync();
        await this.testOfflineSession();
        await this.testDexieOffline();
        console.log('✅ All connectivity tests passed!\n');
      } catch (err) {
        console.error('❌ Connectivity test failed:', err);
      }
    }
  },

  // Manual Test Procedures
  Manual: {
    procedures: {
      'welcome.1': {
        name: 'First-time user email registration',
        steps: [
          '1. Run: await Tests.cmd.reset()',
          '2. Verify welcome page appears',
          '3. Enter name and email',
          '4. Click "Invia Codice"',
          '5. Verify OTP field appears',
          '6. Console shows mock OTP: 123456',
          '7. Enter 123456, click "Conferma"',
          '8. Verify redirect to home',
          '9. Run: await Tests.cmd.check()',
          '10. Verify session: mode="email", verified=true'
        ],
        handler: async () => {
          await KV.clear();
          location.reload();
        }
      },

      'welcome.2': {
        name: 'Anonymous mode',
        steps: [
          '1. Run: await Tests.cmd.reset()',
          '2. Click "Continua senza email"',
          '3. Verify toast: "Modalità offline attivata"',
          '4. Verify redirect to home',
          '5. Run: await Tests.cmd.check()',
          '6. Verify session: mode="anon"'
        ],
        handler: async () => {
          await KV.clear();
          location.reload();
        }
      },

      'welcome.3': {
        name: 'Returning user',
        steps: [
          '1. Run: await Tests.cmd.returning()',
          '2. Verify direct load to home',
          '3. No welcome page shown',
          '4. Menu footer shows email/offline'
        ],
        handler: async () => {
          await AuthService.saveSession('email', 'returning@test.com', true);
          location.reload();
        }
      },

      'welcome.4': {
        name: 'Email validation',
        steps: [
          '1. Run: await Tests.cmd.welcome()',
          '2. Empty email → button disabled',
          '3. Invalid email → shows error',
          '4. Valid email → button enabled'
        ],
        handler: async () => {
          await KV.clear();
          document.querySelector('#myNavigator').resetToPage('html/welcome.html');
        }
      },

      'welcome.5': {
        name: 'OTP validation',
        steps: [
          '1. Complete email step',
          '2. Enter 5 digits → error',
          '3. Enter letters → error',
          '4. Enter 123456 → success'
        ],
        handler: async () => {
          await KV.clear();
          document.querySelector('#myNavigator').resetToPage('html/welcome.html');
        }
      },

      'welcome.6': {
        name: 'Loading states',
        steps: [
          '1. Enter email, click button',
          '2. Button shows "Invio..." (1s)',
          '3. Enter OTP, click button',
          '4. Button shows "Verifica..." (0.5s)'
        ],
        handler: async () => {
          await KV.clear();
          document.querySelector('#myNavigator').resetToPage('html/welcome.html');
        }
      },

      'welcome.7': {
        name: 'Back button',
        steps: [
          '1. Complete email step',
          '2. Click "← Torna indietro"',
          '3. Verify return to step 1',
          '4. Email preserved, OTP cleared'
        ],
        handler: async () => {
          await KV.clear();
          document.querySelector('#myNavigator').resetToPage('html/welcome.html');
        }
      },

      'connectivity.1': {
        name: 'Offline registration',
        steps: [
          '1. Run: await Tests.cmd.welcome()',
          '2. DevTools → Network → Offline',
          '3. Complete registration',
          '4. Verify mock OTP works',
          '5. Session saved to Dexie',
          '6. Footer shows offline icon'
        ],
        handler: async () => {
          await KV.clear();
          document.querySelector('#myNavigator').resetToPage('html/welcome.html');
        }
      },

      'connectivity.2': {
        name: 'Full offline mode',
        steps: [
          '1. Complete registration online',
          '2. Reload app',
          '3. DevTools → Network → Offline',
          '4. Reload again',
          '5. App loads from Service Worker',
          '6. Navigation works',
          '7. Add worker → saved to Dexie',
          '8. Footer shows offline icon',
          '9. Go online → icon updates'
        ],
        handler: async () => {
          console.log('Manual procedure - use DevTools');
        }
      }
    },

    run(testId) {
      const test = this.procedures[testId];
      if (!test) {
        console.error(`❌ Test ${testId} not found`);
        console.log('Available:', Object.keys(this.procedures).join(', '));
        return;
      }
      
      console.log(`\n📋 ${testId}: ${test.name}`);
      console.log('─'.repeat(50));
      test.steps.forEach(s => console.log(s));
      console.log('─'.repeat(50));
      console.log(`Start: await Tests.Manual.start('${testId}')\n`);
    },

    async start(testId) {
      const test = this.procedures[testId];
      if (!test) {
        console.error(`❌ Test ${testId} not found`);
        return;
      }
      console.log(`▶️  ${test.name}`);
      await test.handler();
    },

    list() {
      console.log('\n📋 Manual Tests:\n');
      Object.entries(this.procedures).forEach(([id, t]) => {
        console.log(`${id}: ${t.name}`);
      });
      console.log('\nUsage: Tests.Manual.run("welcome.1")\n');
    }
  },

  // Command shortcuts
  cmd: {
    async all() {
      await Tests.WelcomePage.runAll();
      await Tests.Connectivity.runAll();
    },
    
    async reset() {
      await KV.clear();
      location.reload();
    },
    
    async welcome() {
      await KV.clear();
      document.querySelector('#myNavigator').resetToPage('html/welcome.html');
    },
    
    async returning() {
      await AuthService.saveSession('email', 'user@test.com', true);
      location.reload();
    },
    
    async returningAnon() {
      await AuthService.saveSession('anon', '', false);
      location.reload();
    },
    
    async check() {
      const session = await AuthService.checkSession();
      console.log('Current session:', session);
    },
    
    async kv() {
      const all = await db.kv.toArray();
      console.table(all);
    }
  }
};

// Quick access aliases
window.test = Tests.cmd;
window.manual = Tests.Manual;