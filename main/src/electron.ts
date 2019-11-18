import { BrowserWindow, app, ipcMain, IpcMessageEvent, dialog } from 'electron';
import * as isDev from "electron-is-dev";
import * as path from 'path'
import * as childProcess from "child_process"
import * as fs from "fs"

import { readDir, rootDir } from "./getFiles"

let mainWindow: BrowserWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, height: 600, webPreferences: {
            nodeIntegration: true,
        }
    });
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow.destroy()));
}

const getCommands = async () => {
    mainWindow.webContents.send('log', rootDir);
    mainWindow.webContents.send('commands', (await readDir("Commands")));
    mainWindow.webContents.send('programs', (await readDir("Programs")));
    mainWindow.webContents.send('powershell', (await readDir("PowerShell")));
}

ipcMain.on('getCommands', getCommands)

ipcMain.on('uploadFile', async () => {
    const filePaths = await dialog.showOpenDialog({
        title: "Upload a file"
    })

    if(filePaths) {
        const file = filePaths[0]
        const ext = path.extname(file)

        if(ext === '.bat') {
            fs.copyFile(file, rootDir + "Commands/" + path.basename(file), () => {
                getCommands()
            })
        }
        else if(ext === '.ps1') {
            fs.copyFile(file, rootDir + "PowerShell/" + path.basename(file), () => {
                getCommands()
            })
        }
        else {
            fs.copyFile(file, rootDir + "Programs/" + path.basename(file), () => {
                getCommands()
            })
        }
    }
})

function execFile(path: string) {
    let ext = path.split(".").pop()

    path = path.replace(/\//g, "\\")

    let parts = path.split("\\")
    let newParts = []
    for(let part of parts) {
        console.log(part)
        if(part.includes(" ")) {
            newParts.push(`"${part}"`)
        }
        else {
            newParts.push(part)
        }
    }

    path = newParts.join("\\")

    if(ext == "ps1") {
        childProcess.exec(`start powershell.exe -command ${path}`)
    }
    else {
        childProcess.exec(`start ${path}`)
    }
}

ipcMain.on("exec-command", async (event: any, path: string) => {
    execFile(path)
})

ipcMain.on("runMultiple", async (event: any, paths: string[]) => {
    paths.forEach(path => {
        execFile(path)
    })
})

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});