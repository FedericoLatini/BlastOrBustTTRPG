chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
      chrome.tabs.create({url: "https://ad-skipy.com/welcome"});
  }
});
chrome.runtime.setUninstallURL("https://ad-skipy.com/bye", function() {});