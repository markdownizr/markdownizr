// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

// check the message from content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "result_exists") {
      // parse incoming html for markdown
      var markdown = toMarkdown(request.content);
      // create a ghost input to hold the fresh markdown
      const textarea = document.createElement('textarea');
      textarea.style.position = 'fixed';
      textarea.style.opacity = 0;
      // put da markdown in da box
      textarea.value = markdown;
      // put da box on the page
      document.body.appendChild(textarea);
      // select the newly appended text
      textarea.select();
      // copy it
      document.execCommand('Copy');
      // cover the tracks
      document.body.removeChild(textarea);
    }
  }
);