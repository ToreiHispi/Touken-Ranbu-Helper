// Send Welcome Message
chrome.runtime.sendMessage({
  type: 'notify',
  message: {
    title: 'Welcome to ~TKRB Helper~',
    message: 'To open the tool, press F12 or right-click in a blank space and select "Inspect".',
    context: 'Build version：2.2.2'
  }
})
