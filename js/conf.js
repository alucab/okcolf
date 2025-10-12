/***********************************************************************
 * App Configuration. This file contains the configuration of the application. *
 * MVP: 
 * the social security payments configuration
 * the contract thresholds for hours worked organized per year
 ***********************************************************************/

// Google Apps Script API Configuration
const GAS_CONFIG = {
  // Set this to your deployed Google Apps Script Web App URL
  API_URL: '', // Example: 'https://script.google.com/macros/s/AKfycby.../exec'
  
  // Enable mock mode for development (bypasses real API calls)
  USE_MOCK: true, // Set to false when GAS backend is deployed
  
  // Timeout for API requests (milliseconds)
  TIMEOUT: 10000
};

const appState = {
  activePage: 'dashboard',
  isEmployerConfigured: false,
  isWorkerConfigured: false,
  isContractConfigured: false,
  isUserAnonymous: true,
  userEmail: '',
  isSocialSecurityDeadlinePassed: false,
  isApplicationConnected: navigator.onLine,
  workers: [],

  setConnection(status) { 
    this.isApplicationConnected = status 
  },

  setPage(page) { this.activePage = page.id || 'dashboard' },

  async init() {
    await window.db.open();
    await window.KV.get("")
    const workers = await window.db.workers.toArray();
    if (workers.length) this.activeWorker = workers[0];
    this.workers = workers;
  }
}


$d.on('alpine:init', () => {

  console.log('Alpine:init fired but ignored');
});

$d.on('DOMContentLoaded', async () => {
  console.log('DOM fully loaded and parsed');

  ons.ready(async () => {
    console.log('Onsen UI is ready');

    if (window.Alpine && !Alpine.store('appState')) {
      Alpine.store('appState', appState);
    }

    // Wait for initApp to finish
    await initApp();

    // Now safe to attach global listeners
    $w.on('online', () => Alpine.store('appState').setConnection(true));
    $w.on('offline', () => Alpine.store('appState').setConnection(false));
  });
});

['DOMContentLoaded', 'alpine:init', 'init', 'onsready'].forEach(eventName => {
  window.addEventListener(eventName, (ev) => {
    console.log(`🔥 Event: ${ev.type}`);
    console.log(`🔥 Target:`, ev.target);
    //console.trace();
  });
});

$d.on('init', function (event) {

  Alpine.store('appState')?.setPage(event.target);

});