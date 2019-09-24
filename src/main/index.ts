import { app, BrowserWindow, protocol } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

app.on('ready', () => {
  protocol.registerFileProtocol('ta', (request, callback) => {
    const url = request.url.substr(5)
    callback(path.normalize(`${url}`))
  }, (error) => {
    if (error) {
      // tslint:disable-next-line: no-console
      console.error('Failed to register protocol')
      // TODO:
    }
  })
})

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    width: 800,
    height: 600,
    resizable: false,
    frame: false,
    titleBarStyle: 'hiddenInset'
  })

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    .then(() => {
      //
    })
    .catch(() => {
      //
    })
  } else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
    .then(() => {
      //
    })
    .catch(() => {
      //
    })
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})
