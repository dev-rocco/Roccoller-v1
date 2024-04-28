const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('node:path');
const fs = require("fs");

const cfgPath = "./config.json";
let cfgContent = JSON.parse(fs.readFileSync(cfgPath));

// In main scope for access from IPC
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: parseInt(cfgContent.width),
    height: parseInt(cfgContent.height),
    x: 0,
    y: 0,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    alwaysOnTop: parseInt(cfgContent.alwaysOnTop)
  });

  mainWindow.loadFile("src/index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle renderer request for config.json
ipcMain.on("cfgRequest", (event, args) => {
    mainWindow.webContents.send("cfgReturn", cfgContent);
});
