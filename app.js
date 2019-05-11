const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;

// Outer Window
let mainWindow;

// Listen for the app to be ready
app.on('ready', () => {

    // Create new window (Browser Window is electron Object)
    mainWindow = new BrowserWindow({});
    // load html into window
    mainWindow.loadURL(url.format({
        // __dirname -> <current_dir>
        pathname: path.join(__dirname, 'main_window.html'),
        protocol: 'file:',
        slashes: true
    })); // This code will generate path ->  'file://dirnamemain_window.html'

    // !Build menu from the template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // !Insert menu into mainWindow
    Menu.setApplicationMenu(mainMenu);

});


// !Create Menu template
// *menu in electron is array of object
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [ // Creating submenu for the File Menu 
            {
                label: 'Add Item'
            },
            {
                label: 'Clear Item'
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


