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