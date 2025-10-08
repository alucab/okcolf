// Declare Tests first
window.Tests = {
  suites: {},
  register(name, suite) { this.suites[name] = suite; },
  async runAll() {
    for (const suite of Object.values(this.suites)) {
      if (suite.runAll) await suite.runAll();
    }
  }
};

console.log('🧪 Test framework loaded');

window.test = {
  async all() { await Tests.runAll(); },
  async reset() { await KV.clear(); location.reload(); },
  async welcome() { await KV.clear(); document.querySelector('#myNavigator').resetToPage('html/welcome.html'); },
  async returning() { await AuthService.saveSession('email', 'user@test.com', true); location.reload(); },
  async check() { console.log(await AuthService.checkSession()); },
  async kv() { console.table(await db.kv.toArray()); }
};

console.log('🧪 Test helpers loaded');
// Then import test suites
//import './welcome.test.js';
//import './connectivity.test.js';

console.log('🧪 Test suites loaded');