const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd'),
  hardResetMethod: 'exit'
});

// SET ENV to production
// process.env.NODE_ENV = 'production'
process.env.NODE_ENV = 'development';

// Outer Window
let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', () => {
  // Create new window (Browser Window is electron Object)
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  // load html into window
  mainWindow.loadURL(
    url.format({
      // __dirname -> <current_dir>
      pathname: path.join(__dirname, 'main_window.html'),
      protocol: 'file:',
      slashes: true
    })
  ); // This code will generate path ->  'file://dirnamemain_window.html'

  // ?Quit all child windows, when main window is closed
  mainWindow.on('closed', () => {
    app.quit();
  });

  // !Build menu from the template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // !Insert menu into mainWindow
  Menu.setApplicationMenu(mainMenu);
});

// create add window
let createAddShoppingWindow = () => {
  // Create new window (Browser Window is electron Object)
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add Shopping List Item!!',
    webPreferences: {
      nodeIntegration: true
    }
  });
  // load html into window
  addWindow.loadURL(
    url.format({
      // __dirname -> <current_dir>
      pathname: path.join(__dirname, 'add_window.html'),
      protocol: 'file:',
      slashes: true
    })
  ); // This code will generate path ->  'file://dirnamemain_window.html'

  // Grabage collection handle
  addWindow.on('close', () => {
    addWindow = null;
  });
};

// !Catch item:add, passing data from add_window to app.js and then app.js to main_window.html
ipcMain.on('addwindow->app', (event, item) => {
  console.log(item);
  mainWindow.webContents.send('app->mainWindow', item); // Passing data frm app.js to main_window.html
  addWindow.close();
});

// !Create Menu template
// *menu in electron is array of object
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      // Creating submenu for the File Menu
      {
        label: 'Add Item2',
        click() {
          createAddShoppingWindow();
        }
      },
      {
        label: 'Clear Item',
        click() {
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        // 'accelerator' Is used -> for Hotkey command
        // node > process.platform -----can_give_following_values_for_diff_os----->
        // 'darwin' (Macos), 'freebsd', 'linux' (Linux), 'sunos' or 'win32' (Windows)
        accelerator: process.platform == 'drawin' ? 'Command+Q' : 'ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// In Mac, In menu we see the electron rather than - file, to solve this problem
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({}); // addiding empty object in the mainMenuTemplate array
}

// ADD developer tools items if not in production
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'DevTool',
    submenu: [
      {
        label: 'Toogle DevTools',
        accelerator: process.platform == 'drawin' ? 'Command+I' : 'ctrl+I',
        click(item, focusedWindow) {
          //focusedWindow -> developer tool whill be showing all the parent and child windows
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
