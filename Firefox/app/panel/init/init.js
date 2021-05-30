
// Init Panel & Create Panel
browser.devtools.panels.create(
  '~*TKRBH*~',
  '/static/icon_128.png', // No icon path
  '/app/panel/index.html',
  function (panel) {
    // Welcome
    chrome.runtime.sendMessage({
      type: 'notify',
      message: {
        title: 'Welcome to ~TKRB Helper~',
        message: 'Please find the new "~*TKRBH*~" tab in the Developer Tools panel.',
<<<<<<< HEAD
        context: 'Build version：2.1.2'
=======
        context: 'Build version：2.2.0'
>>>>>>> dev
      }
    })
  }
)
