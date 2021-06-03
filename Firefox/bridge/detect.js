// Send Welcome Message
chrome.runtime.sendMessage({
  type: 'notify',
  message: {
    title: 'Welcome to ~TKRB Helper~',
    message: 'To open the tool, press F12 or right-click in a blank space and select "Inspect".',
<<<<<<< HEAD
<<<<<<< HEAD
    context: 'Build version：2.1.2'
=======
    context: 'Build version：2.2.0'
>>>>>>> dev
=======
    context: 'Build version：2.2.2'
>>>>>>> dev
  }
})
