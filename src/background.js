;(function () {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) return
  window.hasRun = true

  // localStorage.clear(); // bust any cached settings

  // default settings
  var settings = new Store('settings', {
    strip_elements:
      'div, span, small, aside, section, article, header, footer, hgroup, time, address, button',
    delete_elements:
      'script, noscript, canvas, embed, object, param, svg, source, nav, iframe, details',
  })

  // a context menu (right click)
  chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      title: 'Get Markdown',
      id: 'getMarkdown',
      contexts: ['page', 'selection'],
    })
  })

  function callTab(tab) {
    // Send a message to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0]
      chrome.tabs.sendMessage(activeTab.id, { message: 'wants_markdown' })
    })
  }
  // Called when the user clicks on the browser action.
  chrome.browserAction.onClicked.addListener(function (tab) {
    callTab(tab)
  })

  // Called when the user clicks on the context menu action.
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === 'getMarkdown') {
      callTab(tab)
    }
  })

  // check the message from content.js
  chrome.runtime.onMessage.addListener(function (
    request
    // sender,
    // sendResponse
  ) {
    if (request.message === 'result_exists') {
      // Build filter args
      var stripped_elements = settings.get('strip_elements').split(', ')
      var deleted_elements = settings.get('delete_elements').split(', ')

      // parse incoming html for markdown
      var markdown = toMarkdown(request.content, {
        // filter out stuff
        converters: [
          {
            // grab the settings
            filter: stripped_elements,
            replacement: function (innerHTML, node) {
              return innerHTML
            },
          },
          {
            // don't include these in the final markdown
            filter: deleted_elements,
            replacement: function () {
              return ''
            },
          },
        ],
      })

      console.info('Got markdown:')
      console.log(markdown)

      // create a ghost input to hold the fresh markdown
      const textarea = document.createElement('textarea')
      textarea.style.position = 'fixed'
      textarea.style.opacity = 0
      // put da markdown in da box
      textarea.value = markdown
      // put da box on the page
      console.info('Appending textrea with markdown:')
      console.log(textarea)
      document.body.appendChild(textarea)
      // select the newly appended text
      textarea.select()
      // copy it
      document.execCommand('Copy')
      // cover the tracks
      document.body.removeChild(textarea)
    } else {
      alert('Oops! No content received.')
      console.log("Don't see any content to use for markdown :(")
    }
  })
})()
