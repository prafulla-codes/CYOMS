var ModifyProperties = require('./ModifyProperties');
const https = require('https');
const axios = require('axios');
const fs = require('fs');
const exec = require('child_process').exec;
const electronInstaller = require('electron-winstaller');
const electron = require('electron');
const url = require('url')
const path = require('path')
const {download} = require("electron-dl");
const {app, BrowserWindow, Menu, ipcMain, dialog,ipcRenderer, shell} = electron;
// Below function is executed after download of server.jar is completed.
function createForWindows(serverSpecifications,selectedFolder,window)
{
    // Step 1 - Create server.sh file
    fs.writeFile(selectedFolder+"/server.bat",`@ECHO OFF
    java -Xms1024M -Xmx1024M -jar server.jar nogui
    pause`,(err,solution)=>{
        if(err)
        {
        console.log("Error creating server.bat");
        window.webContents.send('server_failure',{"message":"Something went wrong :("})
        }
        else
        {
        console.log("Created server.bat");
        // Step 2 - Execute server.bat for the first time (to get eula,server.properties..etc)
        exec(`java -Xms1024M -Xmx1024M -jar server.jar nogui`,{cwd:String(selectedFolder)},(err,output)=>{
            if(err)
            {
                console.log("Error Running server.bat [ First Time ]")
                window.webContents.send('server_failure',{"message":"Please check if Java is installed on the machine."})

            }
            else
            {
                console.log(output); // Successfully Run for first time with EULA Running
                console.log("server.bat running..")
                // Step 4 - Read eula.txt and modify the eula to true
                fs.readFile(selectedFolder+"/eula.txt","utf-8",(err,data)=>{
                if(err){
                console.log(err);
                window.webContents.send('server_failure',{"message":"Error Failed Creating Server"})
            }
                else
                {
                    var result = data.replace(/eula=false/g, 'eula=true'); // Modify eula to true
                    fs.writeFile(selectedFolder+"/eula.txt", result, 'utf8', function (err) {
                        if (err){
                            console.log(err);
                            window.webContents.send('server_failure',{"message":"Error Failed Creating Server"})

                        }
                        else 
                        {
                            console.log("** EULA CHANGED TO TRUE **");
                            ModifyProperties(serverSpecifications,selectedFolder,window)
                        }
                        
                        })
                    }
                });
            }
            })
    
            }}
         )
}


module.exports = createForWindows;