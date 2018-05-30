chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.message === "wants_markdown") {
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

      // create a special div, just for markdownizr status updates
      $( "body" ).append("<div id='markdownizr-status'></div>");

      // function for showing the user what happened in markdownizr land
      function statusMessage(status) {
        console.log("status func called");
        $("#markdownizr-status").css({
          "display": "none",
          "color": "white",
          "font-family": "monospace",
          "font-size": "24px",
          "text-align": "center",
          "width": "20%",
          "min-width": "240px",
          "background": "rgba(0, 0, 0, .5)",
          "border-radius": "10px",
          "padding": "1em",
          "position": "fixed",
          "z-index": "1000000000", // a billion
          // center it
          "left": "50%",
          "top": "20%",
          "margin-left": "-10%" // Negative half of width.
        });
        // set the prose in the div depending on $argv[0]
        if (status == "success") {
          $("#markdownizr-status").text("Markdown Copied To Clipboard");
        } else {
          $("#markdownizr-status").text("Oops! Please Try Again");
        }
        // tell the status div to make an appearance, then leave
        $( "#markdownizr-status" ).fadeIn(500).delay(1500);
        $( "#markdownizr-status" ).fadeOut(500);
      }
      if (html) {
        // console.log(html.innerHTML);
        // send a message to background.js
        chrome.runtime.sendMessage({
          "message": "result_exists",
          "url": page_location,
          "content": html.innerHTML
        });
        statusMessage("success");
      } else {
        chrome.runtime.sendMessage({
          "message": "no_result",
          "url": page_location,
          "content": html.innerHTML
        });
        statusMessage("oops");
      };

    }
  }
);
