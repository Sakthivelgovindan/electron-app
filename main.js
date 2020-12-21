'use strict';

// Import parts of electron to use
const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  Menu,
  shell,
  dialog,
  globalShortcut,
  desktopCapturer,
} = require('electron');
const path = require('path');
const url = require('url');
const ProgressBar = require('electron-progressbar');

const { CATCH_ON_MAIN, SEND_TO_RENDER, CATCH_WORK_STATUS } = require('./utils/constants');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;
if (
  process.defaultApp ||
  /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
  /[\\/]electron[\\/]/.test(process.execPath)
) {
  dev = true;
}

function copyData() {
  var progressBar = new ProgressBar({
    indeterminate: false,
    title: 'Copying....',
    text: 'Preparing data...',
    detail: 'Wait...',
    browserWindow: {
      width: 350,
      autoHideMenuBar: true,
    },
  });

  progressBar
    .on('completed', function () {
      console.info(`completed...`);
      progressBar.detail = 'Task completed. Exiting...';
    })
    .on('aborted', function (value) {
      console.info(`aborted... ${value}`);
    })
    .on('progress', function (value) {
      progressBar.detail = `Value ${value} out of ${
        progressBar.getOptions().maxValue
      }...`;
    });

  setInterval(function () {
    if (!progressBar.isCompleted()) {
      progressBar.value += 1;
    }
  }, 20);
}

function progressData() {
  var progressBar = new ProgressBar({
    title: 'Progressing...',
    text: 'Preparing data...',
    detail: 'Wait...',
    browserWindow: {
      width: 350,
      autoHideMenuBar: true,
    },
  });

  progressBar
    .on('completed', function () {
      console.info(`completed...`);
      progressBar.detail = 'Task completed. Exiting...';
    })
    .on('aborted', function () {
      console.info(`aborted...`);
    });

  setTimeout(function () {
    progressBar.setCompleted();
  }, 5000);
}

function showNotification() {
  let notification = new Notification({
    title: 'My App',
    body: 'Test message!',
  });
  notification.on('click', (event, arg) => {
    console.log('clicked');
  });

  notification.show();
}

function selectFile() {
  dialog.showOpenDialogSync(mainWindow, {
    properties: ['openFile', 'openDirectory'],
  });
}

function showMessageInfoBox() {
  dialog.showMessageBoxSync(mainWindow, {
    type: 'info',
    title: 'Help',
    message: 'Please contact workfolio team.',
    buttons: ['Ok'],
  });
}

function saveFile() {
  dialog.showSaveDialogSync(mainWindow, {
    type: 'info',
    title: 'Message',
    message: 'Welcome to workfolio!!',
    buttons: ['Ok', 'Cancel'],
  });
}

function globalScopeCopied() {
  let notification = new Notification({
    title: 'Global scope',
    body: 'Global scope copied!!!!',
  });
  notification.on('click', (event, arg) => {
    console.log('clicked');
  });

  notification.show();
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    title: 'Workfolio',
    icon: 'images/workfolio.png',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  let indexPath;
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true,
    });
  }
  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Open the DevTools automatically if developing
    if (dev) {
      mainWindow.setProgressBar(0.5);

      mainWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

ipcMain.on(CATCH_ON_MAIN, (event, args) => {
  console.log('Comes data', args);

  // let n = new Notification({ title: 'My App', body: 'Test message!' });
  // n.on('click', (event, arg) => {
  //   console.log('clicked');
  // });

  // n.show();
  // mainWindow.send(SEND_TO_RENDER, 'pong');
});

ipcMain.on(CATCH_WORK_STATUS, (event, args) => {
  console.log('Comes');
  let n = new Notification({ title: 'Work status', body: `You are now ${args}!!` });
  n.on('click', (event, arg) => {
    console.log('clicked');
  });
  n.show();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow();
  const template = [
    {
      label: 'Task',
      submenu: [
        {
          label: 'New window',
          click: function () {
            shell.openExternal('https://www.electronjs.org/docs/api/menu');
          },
        },
        { type: 'separator' },
        {
          label: 'Progress',
          submenu: [
            {
              label: 'Progress bar',
              click: function () {
                progressData();
              },
            },
            { type: 'separator' },
            {
              label: 'Copy data',
              accelerator: process.platform === 'darwin' ? 'Cmd+I' : 'Control+I',
              click: function () {
                copyData();
              },
            },
          ],
        },

        { type: 'separator' },
        {
          label: 'Select',
          checked: true,
          enabled: true,
          click: function () {
            console.log('Clicked');
            selectFile();
          },
        },
        { type: 'separator' },
        {
          label: 'Notification',
          accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Control+N',
          click: function () {
            console.log('Clicked');
            showNotification();
          },
        },

        { type: 'separator' },
        {
          label: 'Save',
          checked: true,
          enabled: true,
          click: function () {
            console.log('Clicked');
            saveFile();
          },
        },
      ],
    },
    {
      label: 'Developer',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      click: function () {
        showMessageInfoBox();
      },
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  const ret = globalShortcut.register('CommandOrControl+G', () => {
    globalScopeCopied();
  });

  if (!ret) {
    console.log('registration failed');
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
  globalShortcut.unregister('CommandOrControl+X');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
