
// Init Panel & Create Panel
chrome.devtools.panels.create(
  '~Tourabu~',
  '/static/icon_128.png', // No icon path
  '/app/panel/index.html',
  function (panel) {
    // Welcome
    chrome.runtime.sendMessage({
      type: 'notify',
      message: {
        title: 'Welcome to ~TKRB Helper~',
        message: 'Please find the new "~*TKRBH*~" tab in the Developer Tools panel.',
        context: 'Build version：2.2.3'
      }
    })
  }
)
