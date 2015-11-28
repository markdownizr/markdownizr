chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.message === "clicked_browser_action") {
      // get url of the current url
      var page_location = window.location.href;
      // get selection
      var selection = window.getSelection();
      // start out with the whole page
      var body = document.getElementsByTagName("body");
      // place to stash the html source
      var html = document.createElement('html');
      // check if user has highlighted any content
      if (selection.type === "Range") {
        // get the highlighted content's source
        var range = selection.getRangeAt(0);
        // stash it
        html.appendChild(range.cloneContents());
      } else {
        // stash the entire <body>
        range = document.createRange();
        range.selectNode(document.getElementsByTagName("body").item(0));
        documentFragment = range.cloneContents();
        html.appendChild(documentFragment);
      }

      if (html) {
        // console.log(html.innerHTML);
        // send a message to background.js
        chrome.runtime.sendMessage({
          "message": "result_exists",
          "url": page_location,
          "content": html.innerHTML
        });
      } else {
        chrome.runtime.sendMessage({
          "message": "no_result",
          "url": page_location,
          "content": html.innerHTML
        });
      };

    }
  }
);
