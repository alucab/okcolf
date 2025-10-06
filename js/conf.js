/***********************************************************************
 * App Configuration. This file contains the configuration of the application. *
 * MVP: 
 * the social security payments configuration
 * the contract thresholds for hours worked organized per year
 ***********************************************************************/

// App logic.

// App logic.
window.myApp = {};
window.myApp.conf = {};

$w.on('online', () => { updateStatus(); triggerSync();addLog('online', 'Connessione ripristinata') });
$w.on('offline', () => { updateStatus();addLog('online', 'Connessione persa')});
        


$d.on('init', function(event) {
  var page = event.target;

  // Each page calls its own initialization controller.
  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.

});

$d.on('DOMContentLoaded', () => {
    ons.ready(initApp);
});

$d.on('alpine:init', () => {
  Alpine.data('appState', () => ({
    activePage: 'dashboard',
    isEmployerConfigured: false,
    isWorkerConfigured: false,
    isContractConfigured: false,
    isUserAnonymous: true,
    isSocialSecurityDeadlinePassed: false,


    async init() {
      await db.open();
      const workers = await db.workers.toArray();
      if (workers.length) this.activeWorker = workers[0];
      this.refreshDashboard();
    },

    async refreshDashboard() {
      if (!this.activeWorker) return;
      const sessions = await db.work_sessions
        .where('worker_id').equals(this.activeWorker.id)
        .toArray();
      this.workSessions = sessions;
      this.weeklyHours = sessions
        .filter(s => this.isThisWeek(s.date))
        .reduce((acc, s) => acc + s.hours_worked, 0);
    },

    isThisWeek(dateStr) {
      const d = new Date(dateStr);
      const now = new Date();
      const week = 1000 * 60 * 60 * 24 * 7;
      return now - d < week;
    }
  }));
});