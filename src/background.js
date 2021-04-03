import TurndownService from 'turndown'
import { gfm } from 'joplin-turndown-plugin-gfm'

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
   * Default user settings
   */
  const settings = new Store('settings', {
    // Render these elements into markdown output as HTML
    keep_elements: '',
    // Do not consider these elements when rendering markdown output
    delete_elements:
      'script, style, title, noscript, canvas, embed, object, param, svg, source, iframe',
  })
  const keepElements = settings.get('keep_elements').split(', ')
  const deleteElements = settings.get('delete_elements').split(', ')

  /**
   * Markdown service
   */
  const turndownOptions = {
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
    hr: '----------',
  }
  let turndownService = new TurndownService(turndownOptions)

  // Use GitHub Flavored Markdown Turndown plugin
  // Fop better table and strikethrough support

  // Use the gfm plugin
  turndownService.use(gfm)

  // Use the table and strikethrough plugins only
  // turndownService.use([tables, strikethrough])

  // Apply settings for elements to keep and delete
  turndownService.remove(deleteElements)
  turndownService.keep(keepElements)

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
        !node.textContent.length &&
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
    console.info('Copied markdown value from textarea to clipboard.')
  })
})()
