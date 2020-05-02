
var CreateServerLinux = require('./CreateServerLinux');
var CreateServerWindows = require('./CreateServerWindows')
const https = require('https');
const axios = require('axios');
const fs = require('fs');
const electronInstaller = require('electron-winstaller');
const electron = require('electron');
const url = require('url')
const path = require('path')
const {download} = require("electron-dl");
const {app, BrowserWindow, Menu, ipcMain, dialog,ipcRenderer, shell} = electron;
class CraftServer {

craft(serverSpecifications,window){ // Gets Server Specification and Window (vanilla,bukkit or spigot)

// Step 1 - Log The Server Specifications
    console.log(serverSpecifications);
// Step 2 - Take Server Installation Location Input from user.            
    var server_path = dialog.showOpenDialog({
    title:"Select folder to craft server",
    buttonLabel:"Craft Server",
    properties: ['openDirectory']
    },
    // Call Back Function After Folder Has Been selected
    selectedFolder=>{
        if(selectedFolder=="" || selectedFolder==null || selectedFolder==undefined)
        {
            window.webContents.send('server_failure',{"message":"Invalid Path Selected OR Path not selected"})
        }
        // Step 3 - Log The Server Path
        console.log(`Server Path - ${selectedFolder}`)
        // Step 4 - Download The server.jar file using electron-dl 
        axios.get(String(serverSpecifications.version_url[0].url)) // Fetch The Server Download JSON
        .then(version_json=>{ 
            console.log(version_json.data.downloads.server) // Log the download url path
            download(BrowserWindow.getFocusedWindow(), version_json.data.downloads.server.url,{directory:String(selectedFolder)}) // Save the file at the selectedFolder
        .then(dl=>{
            console.log("Download Complete");
            console.log(dl.getSavePath());
            // Step 4 - Create server.bat file as per the OS Requrements
            if(process.platform=="linux")
            {
                CreateServerLinux(serverSpecifications,selectedFolder,window);
            }
            else if(process.platform=="win32") // For Windows Platform
            {
                CreateServerWindows(serverSpecifications,selectedFolder,window);
            }
            else
            {
                window.webContents.send('server_failure',{"message":`CYOMS v2.0 Supports Windows & Linux, feel free to request support for your OS at assist.cyoms@gmail.com`})
            }
            }).catch(err=>{
                window.webContents.send('server_failure',{"message":"Network Connection Not Found : Please Check Internet Connectivity!"})
            }) 
            }).catch(err=>{
                window.webContents.send('server_failure',{"message":"Network Connection Not Found : Please Check Internet Connectivity!"})
            })
            })      
    }
}

module.exports = CraftServer;