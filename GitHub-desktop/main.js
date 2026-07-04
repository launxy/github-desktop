const { app, BrowserWindow, Menu, shell, ipcMain, Notification } = require('electron');
const path = require('path');

const GITHUB_URL = 'https://github.com';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'GitHub',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#0d1117', // Color oscuro oficial de GitHub
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: false,
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
    autoHideMenuBar: true,
    frame: true,
    show: false,
  });

  // Permitir navegación solo dentro de dominios de GitHub
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://github.com') || url.startsWith('https://gist.github.com')) {
      return { action: 'allow' };
    }
    // Abrir enlaces externos en el navegador predeterminado
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    const allowed = [
      'https://github.com',
      'https://gist.github.com',
      'https://github.blog',
    ];
    const isAllowed = allowed.some(a => url.startsWith(a));
    if (!isAllowed) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.loadURL(GITHUB_URL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Menú mínimo adaptado
  const menuTemplate = [
    {
      label: 'GitHub',
      submenu: [
        { label: 'Recargar', accelerator: 'F5', click: () => mainWindow.webContents.reload() },
        { label: 'Ir al Inicio', accelerator: 'CmdOrCtrl+H', click: () => mainWindow.loadURL(GITHUB_URL) },
        { type: 'separator' },
        { label: 'Herramientas de desarrollo', accelerator: 'F12', click: () => mainWindow.webContents.toggleDevTools() },
        { type: 'separator' },
        { label: 'Salir', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { role: 'selectAll', label: 'Seleccionar todo' },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});