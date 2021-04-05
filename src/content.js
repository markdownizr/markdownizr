// const browser = require("webextension-polyfill");

;(function () {
  // Tell the user if the Markdownization succeeded or failed
  function informUI(status) {
    // Create a special div, just for markdownizr status updates
    const markdownizrStatusEl = document.createElement('div')
    markdownizrStatusEl.id = 'markdownizr-status'
    document.body.appendChild(markdownizrStatusEl)

    // set the prose in the div depending on $argv[0]
    if (status === 'success') {
      markdownizrStatusEl.textContent = 'Markdown Copied To Clipboard'
    } else {
      markdownizrStatusEl.textContent = 'Oops! Something went wrong.'
    }
    // Tell the status div to make an appearance, then leave
    markdownizrStatusEl.classList.add('show')
    setTimeout(function () {
      markdownizrStatusEl.classList.remove('show')
    }, 1000)
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
