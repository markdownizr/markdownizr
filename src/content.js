chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {

            // get selection
            var selection = window.getSelection();
            // check if content is selected
            if (window.getSelection().type === "Range") {
                var range = selection.getRangeAt(0);
                var html = document.createElement('html');
                html.appendChild(range.cloneContents());
                console.log(html);
            } else if (window.getSelection().type === "Caret") {
              var html = $('body');
            } else {
              console.log("Oops, no selection!!!")
            }

            // send object to background.js
            chrome.runtime.sendMessage({
                "message": "selection_exists",
                "url": page_location
            });
        }
    }
);
