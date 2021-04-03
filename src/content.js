;(function () {
  // Tell the user if the Markdownization succeeded or failed
  function informUI(status) {
    // Create a special div, just for markdownizr status updates
    $('body').append("<div id='markdownizr-status'></div>")

    // console.log("status func called");
    $('#markdownizr-status').css({
      display: 'none',
      color: 'white',
      'font-family': 'monospace',
      'font-size': '24px',
      'text-align': 'center',
      width: '20%',
      'min-width': '240px',
      background: 'rgba(0, 0, 0, .5)',
      'border-radius': '10px',
      padding: '1em',
      position: 'fixed',
      'z-index': '100000000', // a trillion
      // center it
      left: '50%',
      top: '20%',
      'margin-left': '-10%', // Negative half of width
    })
    // set the prose in the div depending on $argv[0]
    if (status === 'success') {
      $('#markdownizr-status').text('Markdown Copied To Clipboard')
    } else {
      $('#markdownizr-status').text('Oops! Something went wrong.')
    }
    // tell the status div to make an appearance, then leave
    $('#markdownizr-status')
      .fadeIn(500)
      .delay(1500)
      .fadeOut(500, function () {
        $(this).remove()
      })
  }

  // Listen for a message from background script asking for content to Markdownize
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === 'markdown_pls') {
      // URL of the current url
      const { href: currentHref } = window.location
      // Place to stash the html source
      const html = document.createElement('html')
      html.id = 'markdownizr-stash'

      // Current text selection
      const selection = window.getSelection()
      let range
      if (selection.type === 'Range') {
        // Get the highlighted elements
        range = selection.getRangeAt(0)
      } else {
        // Use the entire `<body>` as source
        range = document.createRange()
        range.selectNode(document.body)
      }

      // Append rnage's HTML content to the surrogate stash element
      documentFragment = range.cloneContents()
      html.appendChild(documentFragment)

      // Phone home (background script) about what happened
      const messageBroadcast = html.innerHTML ? 'result_exists' : 'no_result'
      try {
        chrome.runtime.sendMessage({
          message: messageBroadcast,
          url: currentHref,
          content: html.innerHTML,
        })
        informUI('success')
      } catch (e) {
        informUI('oops')
      }
    }
  })
})()
