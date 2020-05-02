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
function createForLinux(serverSpecifications,selectedFolder,window)
{
    // Step 1 - Create server.sh file
    fs.writeFile(selectedFolder+"/server.sh",`java -Xms1024M -Xmx1024M -jar server.jar nogui PAUSE`,(err,solution)=>{
        if(err)
        {
        console.log("Error creating server.sh");
        window.webContents.send('server_failure',{"message":"Something went wrong :("})
        }
        else
        {
        console.log("Created server.sh");
        // Step 2 - Give execute permission so that server.sh can be executed
        exec(`chmod +x server.sh`,{cwd:String(selectedFolder)},(err,output=>{
            if(err)
            {
                console.log("Error Setting Permission for server.sh [First Time]")
                window.webContents.send('server_failure',{"message":"Permission Error."})

            }
            else
            {
                console.log("Permission set for server.sh");
                // Step 3 - Execute server.sh for the first time (to get eula,server.properties..etc)
                exec(`java -Xms1024M -Xmx1024M -jar server.jar nogui`,{cwd:String(selectedFolder)},(err,output)=>{
                    if(err)
                    {
                        console.log("Error Running server.sh [ First Time ]")
                        window.webContents.send('server_failure',{"message":"Please check if Java is installed on the machine."})

                    }
                    else
                    {
                        console.log(output); // Successfully Run for first time with EULA Running
                        console.log("server.sh running..")
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
                    }
                }))
            }}
         )
}


module.exports = createForLinux;