import TurndownService from 'turndown'

// Uncomment to bust any cached settings while debugging
// localStorage.clear();
;(function () {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) return
  window.hasRun = true

  /**
   * Logger
   */
  const logLarge = (m) =>
    console.log(`%c${m}`, 'font-size: 24px; font-weight: bold')
  const logClassy = (m) =>
    console.log(`%c${m}`, 'font-size: 12px; font-family: serif')

  /**
   * Markdown service
   */
  const turndownOptions = {
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
    hr: '----------',
  }
  let turndownService = new TurndownService(turndownOptions)

  // Suport ~strikethrough~
  // Taken from example at https://github.com/domchristie/turndown#methods
  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'],
    replacement: function (content) {
      return '~' + content + '~'
    },
  })

  // Fence all <pre> elements
  // GitHub, for example, does not use <code> elements in their code blocks.
  // See https://github.com/domchristie/turndown/issues/192
  turndownService.addRule('fenceAllPreformattedText', {
    filter: ['pre'],
    replacement: function (content, node, options) {
      return (
        '\n\n' +
        options.fence +
        '\n' +
        node.textContent +
        '\n' +
        options.fence +
        '\n\n'
      )
    },
  })

  // Patch fragment links that don't have content
  // This is a common pattern on the web. GitHub titles have a small chainlink
  // icon linked to the fragment ID of the section. Copying these as markdown
  // produces a funky link, like `[](#some-section-title)`
  turndownService.addRule('addLinkTextToEmptyFragmentAnchors', {
    filter: function (node, options) {
      return (
        // This is an anchor element
        node.nodeName === 'A' &&
        // Turndown is set to "inlined" link mode
        options.linkStyle === 'inlined' &&
        // The href is an internal fragment link
        node.getAttribute('href').indexOf('#') === 0
      )
    },
    replacement: function (content, node, options) {
      return `[#](${node.getAttribute('href')})`
    },
  })

  /**
   * Default user settings
   * TODO: do we need these anymore? Turndown seems to be taking care of
   * cleaning up the results with its defaults
   * If not, they should be removed from the user settings options
   */
  // const settings = new Store('settings', {
  //   strip_elements:
  //     'div, span, small, aside, section, article, header, footer, hgroup, time, address, button',
  //   delete_elements:
  //     'script, noscript, canvas, embed, object, param, svg, source, nav, iframe, details',
  // })
  // const stripped_elements = settings.get('strip_elements').split(', ')
  // const deleted_elements = settings.get('delete_elements').split(', ')

  // a context menu (right click)
  chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
      title: 'Get Markdown',
      id: 'getMarkdown',
      contexts: ['page', 'selection'],
    })
  })

  /**
   * Browser extention business
   */
  // Send a message to the active tab (content script), saying thr markdown are
  // belong to us
  function askTabForMarkdown() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      chrome.tabs.sendMessage(activeTab.id, { message: 'markdown_pls' })
    })
  }

  // Listen for a click on the browser action (the plugin's toolbar icon)
  chrome.browserAction.onClicked.addListener(function (tab) {
    askTabForMarkdown()
  })

  // Listen for the context (right-click) menu button being triggered
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    // If the context menu option is angry, ask for the markdowns
    if (info.menuItemId === 'getMarkdown') {
      askTabForMarkdown()
    }
  })

  // Listen for message from the content script
  // Pray that it sends word of new lightweight markup coming down from the
  // shores of yonder. So lonely here without semantically structured plain
  // text.
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message !== 'result_exists') return

    // Convert the HTML to The Markdown
    const { content: html } = request
    const theMarkdown = turndownService.turndown(html)

    if (theMarkdown.length) {
      logLarge('Got Markdown! 🎉')
      logClassy(theMarkdown)
    }

    // Put the markdown in a clandestine textarea inside background.html
    const textarea = document.createElement('textarea')
    textarea.id = `${Date.now()}`

    console.info('Injecting markdown into textarea...')
    textarea.value = theMarkdown
    document.body.appendChild(textarea)
    console.log(textarea)

    textarea.select()
    document.execCommand('Copy')
    console.info('Copyied markdown value from textarea to clipboard.')
  })
})()
