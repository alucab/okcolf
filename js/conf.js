/***********************************************************************
 * App Configuration. This file contains the configuration of the application. *
 * MVP: 
 * the social security payments configuration
 * the contract thresholds for hours worked organized per year
 ***********************************************************************/





$d.on('alpine:init', () => {
  Alpine.store('appState', {
    activePage: 'dashboard',
    isEmployerConfigured: false,
    isWorkerConfigured: false,
    isContractConfigured: false,
    isUserAnonymous: true,
    isSocialSecurityDeadlinePassed: false,
    isApplicationConnected: navigator.onLine,
    workers: [],

    setConnection(status) { this.isApplicationConnected = status },

    setPage(page) { this.activePage = page.id || 'dashboard' },

    async init() {
      await window.db.open();
      await window.KV.get("")
      const workers = await window.AppDB.workers.toArray();
      if (workers.length) this.activeWorker = workers[0];
      this.workers = workers;
    }
  })
});

$d.on('DOMContentLoaded', () => {
  ons.ready(() => {
    initApp();

    // Listener globali dopo che Alpine e Onsen sono pronti
    $w.on('online', () => Alpine.store('app').setConnection(true));
    $w.on('offline', () => Alpine.store('app').setConnection(false));
  });
});

$d.on('init', function(event) {
  
  Alpine.store('appState')?.setPage(event.target);

});

