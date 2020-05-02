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

function ModifyProperties(serverSpecifications,selectedFolder,window)
{
    fs.readFile(selectedFolder+"/server.properties","utf8",(err,data)=>{
        if(err){
        window.webContents.send('server_failure',{"message":"Error Failed Creating Server"})
        return console.log(err)
        }
        else
        {
        // Replace broadcast-rcon-to-ops
        var result = data.replace(/broadcast-rcon-to-ops=true/g,`broadcast-rcon-to-ops=${serverSpecifications["broadcast-rcon-to-ops"]}`)
        // Replace view-distance
        result = result.replace(/view-distance=10/g,`view-distance=${serverSpecifications["view-distance"]}`)
        // Replace max-build-height
        result = result.replace(/max-build-height=256/g,`max-build-height=${serverSpecifications["max-build-height"]}`)
        // Replace server-ip
        result = result.replace(/server-ip=/g,`server-ip=${serverSpecifications["server-ip"]}`)
        // Replace level-seed
        result = result.replace(/level-seed=/g,`level-seed=${serverSpecifications["level-seed"]}`)
        // Replace rcon-port
        result = result.replace(/rcon-port=25575/g,`rcon-port=${serverSpecifications["rcon-port"]}`)
        // Replace gamemode
        result = result.replace(/gamemode=survival/g,`gamemode=${serverSpecifications["gamemode"]}`)
        // Replace server-port
        result = result.replace(/server-port=25565/g, `server-port=${serverSpecifications["server-port"]}`)
        // Replace allow-nether
        result = result.replace(/allow-nether=true/g, `allow-nether=${serverSpecifications["allow-nether"]}`)
        // Replace enable-command-block
        result = result.replace(/enable-command-block=false/g, `enable-command-block=${serverSpecifications["enable-command-block"]}`)
        // Replace enable-rcon
        result = result.replace(/enable-rcon=false/g, `enable-rcon=${serverSpecifications["enable-rcon"]}`)
        // Replace enable-query
        result = result.replace(/enable-query=false/g, `enable-query=${serverSpecifications["enable-query"]}`)
        // Replace op-permission-level
        result = result.replace(/op-permission-level=4/g, `op-permission-level=${serverSpecifications["op-permission-level"]}`)
        // Replace prevent-proxy-connections
        result = result.replace(/prevent-proxy-connections=false/g, `prevent-proxy-connections=${serverSpecifications["prevent-proxy-connections"]}`)
        // Replace generator-settings
        result = result.replace(/generator-settings=/g, `generator-settings=${serverSpecifications["generator-settings"]}`)
        // Replace resource-pack
        result = result.replace(/resource-pack=/g, `resource-pack=${serverSpecifications["resource-pack"]}`)
        // Replace level-name
        result = result.replace(/level-name=world/g, `level-name=${serverSpecifications["level-name"]}`)
        // Replace rcon.password
        result = result.replace(/rcon.password=/g, `rcon.password=${serverSpecifications["rcon.password"]}`)
        // Replace player-idle-timeout
        result = result.replace(/player-idle-timeout=0/g, `player-idle-timeout=${serverSpecifications["player-idle-timeout"]}`)
        // Replace motd
        result = result.replace(/motd=A Minecraft Server/,`motd=${serverSpecifications["motd"]}`)
        // Replace query.port
        result = result.replace(/query.port=25565/g, `query.port=${serverSpecifications["query.port"]}`)
        // Replace force-gamemode
        result = result.replace(/force-gamemode=false/g, `force-gamemode=${serverSpecifications["force-gamemode"]}`)
        // Replcae hardcore
        result = result.replace(/hardcore=false/g, `hardcore=${serverSpecifications["hardcore"]}`)
        // Replace white-list
        result = result.replace(/white-list=false/g, `white-list=${serverSpecifications["white-list"]}`)
        // Replace pvp
        result = result.replace(/pvp=true/g, `pvp=${serverSpecifications["pvp"]}`)
        // Replace spawn-npcs
        result = result.replace(/spawn-npcs=true/g, `spawn-npcs=${serverSpecifications["spawn-npcs"]}`)
        // Replace generate-structures
        result = result.replace(/generate-structures=true/g, `generate-structures=${serverSpecifications["generate-structures"]}`)
        // Replace spawn-animals
        result = result.replace(/spawn-animals=true/g, `spawn-animals=${serverSpecifications["spawn-animals"]}`)    
        // Replace snooper-enabled
        result = result.replace(/snooper-enabled=true/g, `snooper-enabled=${serverSpecifications["snooper-enabled"]}`)
        // Replace difficulty
        result = result.replace(/difficulty=easy/g, `difficulty=${serverSpecifications["difficulty"]}`)
        // Replace function-permission-level
        result = result.replace(/function-permission-level=2/g, `function-permission-level=${serverSpecifications["function-permission-level"]}`)
        // Replace network-compression-threshold
        result = result.replace(/network-compression-threshold=256/g, `network-compression-threshold=${serverSpecifications["network-compression-threshold"]}`)
        // Replace level-type
        result = result.replace(/level-type=default/g, `level-type=${serverSpecifications["level-type"]}`)
        // Replace spawn-monsters
        result = result.replace(/spawn-monsters=true/g, `spawn-monsters=${serverSpecifications["spawn-monsters"]}`)
        // Replace enforce-whitelist
        result = result.replace(/enforce-whitelist=false/g, `enforce-whitelist=${serverSpecifications["enforce-whitelist"]}`)
        // Replace use-native-transport
        result = result.replace(/use-native-transport=true/g, `use-native-transport=${serverSpecifications["use-native-transport"]}`)
        // Replace max-players
        result = result.replace(/max-players=20/,`max-players=${serverSpecifications["max-players"]}`)
        // Replace resource-pack-sha1
        result = result.replace(/resource-pack-sha1=/,`resource-pack-sha1=${serverSpecifications["resource-pack-sha1"]}`)
        // Replace spawn-protection
        result = result.replace(/spawn-protection=16/,`spawn-protection=${serverSpecifications["spawn-protection"]}`)
        // Replace online-mode
        result = result.replace(/online-mode=true/g,`online-mode=${serverSpecifications["online-mode"]}`)
        // Replace allow-flight
        result = result.replace(/allow-flight=false/g,`allow-flight=${serverSpecifications["allow-flight"]}`)
        // Replace max-world-size
        result = result.replace(/max-world-size=29999984/g,`max-world-size=${serverSpecifications["max-world-size"]}`)
        console.log("changing to user config...");
        console.log(result)
        fs.writeFile(selectedFolder+"/server.properties",result,'utf8',(err)=>{
        if(err){
            window.webContents.send('server_failure',{"message":"Try running CYOMS as an administrator"})
        }
        else
        {
        console.log("User Configuration Applied")
        window.webContents.send('server_success',{"path":String(selectedFolder)+"/","platform":process.platform})
        }
        })
        }
    })
}

module.exports = ModifyProperties;
