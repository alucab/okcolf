window.Tests.register('WelcomePage', {
  // Automated tests
  async testSessionCheck() {
    await KV.clear();
    const session = await AuthService.checkSession();
    console.assert(session === null, '❌ Should be null');
    console.log('✅ Session check works');
  },

  async testAnonSession() {
    await AuthService.saveSession('anon', '', false);
    const session = await AuthService.checkSession();
    console.assert(session.mode === 'anon');
    console.log('✅ Anonymous session saves');
    await KV.clear();
  },

  async testEmailSession() {
    await AuthService.saveSession('email', 'test@example.com', true);
    const session = await AuthService.checkSession();
    console.assert(session.mode === 'email');
    console.assert(session.verified === true);
    console.log('✅ Email session persists');
    await KV.clear();
  },

  async testOTPSend() {
    const result = await AuthService.sendOTP('test@example.com');
    console.assert(result.success && result.code === '123456');
    console.log('✅ OTP sends');
  },

  async testOTPVerify() {
    let r = await AuthService.verifyOTP('test@example.com', '123456');
    console.assert(r.success);
    r = await AuthService.verifyOTP('test@example.com', '12345');
    console.assert(!r.success);
    console.log('✅ OTP validates');
  },

  async runAll() {
    console.log('🧪 Welcome Tests\n');
    await this.testSessionCheck();
    await this.testAnonSession();
    await this.testEmailSession();
    await this.testOTPSend();
    await this.testOTPVerify();
    console.log('✅ Complete\n');
  },

  // Manual tests
  manual: {
    '1-email-registration': {
      name: 'Email registration flow',
      steps: [
        'await test.reset()',
        'Enter email → Invia Codice',
        'OTP field appears',
        'Enter 123456 → Conferma',
        'Redirects to home',
        'await test.check() → mode="email"'
      ],
      async run() { await KV.clear(); location.reload(); }
    },

    '2-anonymous-mode': {
      name: 'Anonymous registration',
      steps: [
        'await test.reset()',
        'Click "Continua senza email"',
        'Toast appears',
        'Redirects to home',
        'await test.check() → mode="anon"'
      ],
      async run() { await KV.clear(); location.reload(); }
    },

    '3-returning-user': {
      name: 'Returning user skip welcome',
      steps: [
        'await test.returning()',
        'Loads directly to home',
        'No welcome page'
      ],
      async run() {
        await AuthService.saveSession('email', 'user@test.com', true);
        location.reload();
      }
    },

    '4-email-validation': {
      name: 'Email validation errors',
      steps: [
        'await test.welcome()',
        'Empty → button disabled',
        'Invalid → error shown',
        'Valid → enabled'
      ],
      async run() { await test.welcome(); }
    },

    '5-otp-validation': {
      name: 'OTP validation',
      steps: [
        'Complete email step',
        '5 digits → error',
        'Letters → error',
        '123456 → success'
      ],
      async run() { await test.welcome(); }
    },

    '6-loading-states': {
      name: 'Button loading states',
      steps: [
        'Click → "Invio..." for 1s',
        'OTP → "Verifica..." for 0.5s'
      ],
      async run() { await test.welcome(); }
    },

    '7-back-button': {
      name: 'Back from OTP',
      steps: [
        'Reach OTP screen',
        'Click ← Torna indietro',
        'Email preserved, OTP cleared'
      ],
      async run() { await test.welcome(); }
    }
  }
});