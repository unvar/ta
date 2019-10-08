import { app, BrowserWindow, protocol, ipcMain } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { fileHandlers } from './protocols'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

ipcMain.on('ffmpeg-loaded', (event, arg: string) => {
  process.env.FFMPEG_PATH = arg
})

ipcMain.on('ffprobe-loaded', (event, arg: string) => {
  process.env.FFPROBE_PATH = arg
})

app.on('ready', () => {
  // tslint:disable-next-line: no-console
  protocol.registerFileProtocol('ta', fileHandlers.ta, console.error)
  // tslint:disable-next-line: no-console
  protocol.registerFileProtocol('tav', fileHandlers.tav, console.error)
})

function createMainWindow() {
  const window = new BrowserWindow({
    webPreferences: { nodeIntegration: true },
    width: 1024,
    height: 768,
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
