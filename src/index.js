const { 
  app, 
  BrowserWindow,
  Tray,
  Menu,
  nativeImage,
  dialog
} = require('electron');
const path = require('path');
const { app: express, server } = require('./server')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createTray = () => {
  const iconPath = path.join(__dirname, "./icon/icon.png");
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 24, height: 24 })
  const tray = new Tray(trayIcon)
  const menuTemplate = [
    {
      label: null,
      enabled: false
    },
    {
      label: "Start Service",
      enabled: true,
      click: () => {
        server.listen(express.get('Port'), express.get('Host'), () => {
          menuTemplate[1].enabled = false
          menuTemplate[2].enabled = true
          buildTrayMenu(menuTemplate)
        })
      }
    },
    {
      label: "Stop Service",
      enabled: false,
      click: () => {
        server.close(e => {
          console.log("E: ", e);
          menuTemplate[1].enabled = true
          menuTemplate[2].enabled = false
          buildTrayMenu(menuTemplate)
        })
      }
    },
    {
      label: "About",
      click: () => {
        console.log("Clicked About");
        dialog.showMessageBox({
          type: 'info',
          title: 'Express In Tray Apps V.1.0.0',
          message: 'About....'
        })
      }
    },
    {
      label: "Quit",
      click: () => app.quit()
    },
  ]

  const buildTrayMenu = menu => {
    let lblStatus = 'Inactive'
    let iconStatus = './icon/red.png'
    if(!menu[1].enabled) {
      iconStatus = './icon/green.png'
      lblStatus = 'Active'
    }

    const iconStatusPath = path.join(__dirname, iconStatus)

    menu[0].label = `Service Status ${lblStatus}`
    menu[0].icon = nativeImage.createFromPath(iconStatusPath).resize({ width: 24, height: 24 })

    const trayMenu = Menu.buildFromTemplate(menu)
    tray.setContextMenu(trayMenu)
  }
  
  buildTrayMenu(menuTemplate)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createTray);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    
  }
});

app.on('quit', () => {
  server.close()
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
