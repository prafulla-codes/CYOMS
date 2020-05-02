var CraftServer = require('./js/backend/CraftServer')

const electron = require('electron');
const url = require('url')
const path = require('path')
const https = require('https');
const axios = require('axios');
const fs = require('fs');
const electronInstaller = require('electron-winstaller');
const exec = require('child_process').exec;
const sgMail = require('@sendgrid/mail');

const {download} = require("electron-dl");
const {app, BrowserWindow, Menu, ipcMain, dialog,ipcRenderer, shell} = electron;
let mainWindow;
let manageServersWindow;
let createVanillaWindow;
let createBukkitWindow;
let createSpigotWindow;

// 
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

// Squirrel Snippet 
function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};


// SET ENV TO PRODUCTION 
process.env.NODE_ENV="development"
// SET API
process.env.mail_api_key="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";
sgMail.setApiKey(process.env.mail_api_key);

// Initialize User Screen widths and heights
var width,height;
// Step 1 - Listen for the app to be ready
app.on('ready',()=>{
    var {width, height} = electron.screen.getPrimaryDisplay().size

    // Create New Window 
    mainWindow = new BrowserWindow({
        width:width,
        minWidth:width,
        height:height,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load HTML Into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainWindow.html'),
        protocol:'file:',
        slashes:true
    }))

    // Quit App When Closed
    mainWindow.on('closed',()=>{
        app.quit()
    })
    // Step 3 - Build Mebu From Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // Step 4 - Insert The Menu 
    Menu.setApplicationMenu(mainMenu);
})



/***********************  Server Functions ************************/

// On displayCreateVanilla
ipcMain.on('displayCreateVanilla',()=>{
    // Create New Window 
    var {width, height} = electron.screen.getPrimaryDisplay().size
    createVanillaWindow = new BrowserWindow({
        width: width,
        minWidth:width,
        height:height,
        frame:false,
        minHeight:height,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Load HTML Into the window
    createVanillaWindow.loadURL(url.format({
        pathname: path.join(__dirname,'createVanillaWindow.html'),
        protocol:'file:',
        slashes:true
    }))
    // Garbage Collection
    createVanillaWindow.on('close',()=>{
        createVanillaWindow = null;
    })
})

// on craftVanillaServer
ipcMain.on('craftVanillaServer',(e,serverSpecifications)=>{

var craftServer = new CraftServer();
craftServer.craft(serverSpecifications,createVanillaWindow);
 
})


// on Start Server
ipcMain.on('startServer',(e,data)=>{

    console.log(`Server Path - ${data.path}`)
    if(process.platform=="linux" || process.platform=="win32")
    {
        exec('java -Xms1024M -Xmx1024M -jar server.jar PAUSE',{cwd:String(data.path)},(err,output)=>{
            if(err)
            {
                console.log("Failed to start server");
                if(data.serverType=='vanilla')
                {
                    createVanillaWindow.webContents.send('server_failure_start',{"message":"There was an error starting the server (Perhaps a server is already running on the port) "})

                }
            }
            else
            {
                console.log("Started Server");
            }
        })
    }



})



// Open Select Folder
// Step 2 - Create A Menu Template
const mainMenuTemplate = [
    {
        label:'Settings',
        submenu:[
            {
                label: "Quit",
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
            ]
    }
]

// IF MAC, Add an empty object to menu  (empty object '{}' required in mac because it shows electron instead of file)
if(process.platform == 'darwin')
{
   mainMenuTemplate.unshift({})  //adds an empty object to begeninning
}

// Add Developer Tools if not in productions
if(process.env.NODE_ENV !== 'production')
{
    mainMenuTemplate.push({
        label: 'Dev Tools',
        submenu: [{
            label:'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+D' : 'Ctrl+D',           
            click(item,focusedWindow){
                focusedWindow.toggleDevTools();
            }
        },
        {
            role:'reload'
        }
        ]
    })
}

// FEEDBACK
ipcMain.on('submitFeedback',(e,data)=>{
console.log("Feedback is "+data.feedback)
const msg = {
    to:'assist.cyoms@gmail.com',
    from:data.senderEmail,
    subject:'CYOMS | Feedback',
    text:data.feedback,
}
sgMail.send(msg,(err,result)=>{
    console.log(err);
    if(err==null)
    {
        mainWindow.webContents.send('feedback_sent',{"message":"Your feedback was successfully recorded, Thank you :D "})
    }
    else
    {
        mainWindow.webContents.send('feedback_failed',{"message":"Failed to record your feedback :( "})
    }
    console.log(result);
});
})