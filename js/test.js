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
      if (GAS_CONFIG.USE_MOCK) {
        console.log('✅ 6.1.2: Mock OTP sends correctly');
      } else {
        console.log('✅ 6.1.2: Real OTP sent (check email)');
      }
    },

    async testOTPVerify() {
      if (GAS_CONFIG.USE_MOCK) {
        let result = await AuthService.verifyOTP('test@example.com', '123456');
        console.assert(result.success === true, '❌ Valid OTP should succeed');
        
        result = await AuthService.verifyOTP('test@example.com', '12345');
        console.assert(result.success === false, '❌ 5-digit code should fail');
        
        result = await AuthService.verifyOTP('test@example.com', 'abcdef');
        console.assert(result.success === false, '❌ Non-numeric should fail');
        
        console.log('✅ 6.6: OTP validation works (mock mode)');
      } else {
        console.log('⚠️ Real backend mode - use manual test for OTP verification');
      }
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

  // Backend Integration Tests
  Backend: {
    async testAPIConnection() {
      if (GAS_CONFIG.USE_MOCK) {
        console.log('⚠️ Mock mode enabled - skipping real API test');
        return true;
      }
      
      if (!GAS_CONFIG.API_URL) {
        console.error('❌ API_URL not configured');
        return false;
      }
      
      try {
        const result = await ApiService.request(`${GAS_CONFIG.API_URL}?path=health`, {
          method: 'POST',
          body: JSON.stringify({})
        });
        
        console.assert(result.success === true, '❌ Health check failed');
        console.log('✅ Backend API reachable:', result);
        return true;
      } catch (error) {
        console.error('❌ Backend connection failed:', error.message);
        return false;
      }
    },

    async testRealOTPFlow() {
      if (GAS_CONFIG.USE_MOCK) {
        console.log('⚠️ Mock mode - use testFullOTPFlow() for real test');
        return;
      }
      
      const testEmail = prompt('Enter test email for OTP:');
      if (!testEmail) return;
      
      console.log('📧 Sending OTP to', testEmail);
      const sendResult = await AuthService.sendOTP(testEmail);
      console.log('Send result:', sendResult);
      
      if (sendResult.success) {
        const otp = prompt('Enter OTP from email:');
        if (otp) {
          console.log('🔐 Verifying OTP...');
          const verifyResult = await AuthService.verifyOTP(testEmail, otp);
          console.log('Verify result:', verifyResult);
        }
      }
    },

    async testErrorHandling() {
      console.log('Testing error scenarios...');
      
      // Invalid email
      let result = await AuthService.sendOTP('invalid-email');
      console.log('Invalid email:', result);
      
      // Invalid OTP format
      result = await AuthService.verifyOTP('test@example.com', '12345');
      console.log('Invalid OTP format:', result);
      
      console.log('✅ Error handling test complete');
    },

    async runAll() {
      console.log('🌐 Backend Tests...\n');
      try {
        await this.testAPIConnection();
        await this.testErrorHandling();
        console.log('✅ Backend tests complete!\n');
      } catch (err) {
        console.error('❌ Backend test failed:', err);
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
      console.log('🌍 Connectivity Tests...\n');
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
      'welcome.real.1': {
        name: 'Real OTP Flow (Production Test)',
        steps: [
          '1. Set GAS_CONFIG.USE_MOCK = false',
          '2. Set GAS_CONFIG.API_URL to your deployed URL',
          '3. Run: await Tests.cmd.reset()',
          '4. Enter real email',
          '5. Click "Invia Codice"',
          '6. Check email inbox for OTP',
          '7. Enter received OTP',
          '8. Click "Conferma"',
          '9. Verify redirect to home',
          '10. Run: await Tests.cmd.check()'
        ],
        handler: async () => {
          if (GAS_CONFIG.USE_MOCK) {
            console.warn('⚠️ Still in mock mode. Set GAS_CONFIG.USE_MOCK = false');
          }
          await KV.clear();
          location.reload();
        }
      },

      'backend.deploy.1': {
        name: 'Verify Backend Deployment',
        steps: [
          '1. Deploy Google Apps Script as Web App',
          '2. Copy deployment URL',
          '3. Update GAS_CONFIG.API_URL in conf.js',
          '4. Run: await Tests.Backend.testAPIConnection()',
          '5. Should see "Backend API reachable"',
          '6. Run: await Tests.Backend.testRealOTPFlow()',
          '7. Verify email delivery and OTP verification'
        ],
        handler: async () => {
          console.log('Deployment URL:', GAS_CONFIG.API_URL || 'NOT SET');
          console.log('Mock mode:', GAS_CONFIG.USE_MOCK);
        }
      },

      'privacy.1': {
        name: 'Privacy Notice Validation',
        steps: [
          '1. Open welcome page',
          '2. Verify privacy text visible',
          '3. Verify checkbox present',
          '4. Try to submit without checking box',
          '5. Should show error',
          '6. Check box and submit',
          '7. Should proceed normally'
        ],
        handler: async () => {
          await KV.clear();
          document.querySelector('#myNavigator').resetToPage('html/welcome.html');
        }
      },

      ...Tests.WelcomePage.procedures || {}
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
      console.log(`▶️ ${test.name}`);
      await test.handler();
    },

    list() {
      console.log('\n📋 Manual Tests:\n');
      Object.entries(this.procedures).forEach(([id, t]) => {
        console.log(`${id}: ${t.name}`);
      });
      console.log('\nUsage: Tests.Manual.run("welcome.real.1")\n');
    }
  },

  // Command shortcuts
  cmd: {
    async all() {
      await Tests.WelcomePage.runAll();
      await Tests.Connectivity.runAll();
      await Tests.Backend.runAll();
    },
    
    async reset() {
      await KV.clear();
      location.reload();
    },
    
    async welcome() {
      await KV.clear();
      document.querySelector('#myNavigator').resetToPage('html/welcome.html');
    },
    
    async check() {
      const session = await AuthService.checkSession();
      console.log('Current session:', session);
      console.log('Mock mode:', GAS_CONFIG.USE_MOCK);
      console.log('API URL:', GAS_CONFIG.API_URL || 'NOT SET');
    }
  }
};

// Quick access aliases
window.test = Tests.cmd;
window.manual = Tests.Manual;