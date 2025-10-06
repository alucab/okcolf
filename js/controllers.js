/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/


function switchTabByLabel(label) {
  const tabbar = document.querySelector('#myTabBar');
  const splitter = document.querySelector('#mySplitter');

  const tabs = Array.from(tabbar.querySelectorAll('ons-tab'));
  
  index = tabs.findIndex(tab => tab.getAttribute('label') === label);
  if (index < 0) index = 0; // default to first tab if not found

  tabbar.setActiveTab(index);
  splitter.left.close();
  
  return index >= 0 ? index : null;
}




  //////////////////////////
  // Tabbar Page Controller //
  //////////////////////////


  ////////////////////////
  // Menu Page Controller //
  ////////////////////////


  ////////////////////////////
  // New Task Page Controller //
  ////////////////////////////


  ////////////////////////////////
  // Details Task Page Controller //
  ///////////////////////////////

