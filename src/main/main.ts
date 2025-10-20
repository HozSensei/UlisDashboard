import axios from 'axios';
import {app, BrowserWindow, ipcMain, session, shell, nativeImage, Notification } from 'electron';
import {join} from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { timeStamp } from 'console';

let mainWindow;
let userDataConfig = join(app.getPath('userData'), 'UlisDashboardConfig.json');
const icon = app.getAppPath() + 'static/icon.png';

// Configuration axios pour ignorer les certificats SSL
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});
if (process.platform === 'win32')
{
    app.setAppUserModelId('Ulis Dashboard');
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 900,
    frame:false,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' }
  })

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools()
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('saveApps', async (event, apps) => {
  
  await writeFile(userDataConfig, apps, true);
  const checkAvailability = await getAllMyulisStatus()
  mainWindow.webContents.send('forcePing', checkAvailability)
})

ipcMain.on('window-action', function (event, arg) {
  switch(arg){
    case 'close':
      mainWindow.close()
      break;
    case 'minimize':
      mainWindow.minimize()
      break;
    case 'maximize':
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
      break;
    case 'reload':
      mainWindow.reload()
      break;
  }
});

ipcMain.handle('ping', async () => {
    console.log('electron ping');
    const checkAvailability = await getAllMyulisStatus()
    return checkAvailability;
})

ipcMain.handle('load', async () => {
  let dataToReturn:any = null;
  if (fs.existsSync(userDataConfig)) {
    dataToReturn = fs.readFileSync(userDataConfig, 'utf8');
  }else{
    const initConfigFile = {
      lastEdit: new Date(),
      listApps: [
        {"title":"Myulis - CESW RC","url":"https://myulis.test.cesw.uliege.be", "notif": true},
        {"title":"Myulis - ETNIC RC","url":"https://myulis.test.etnic.uliege.be", "notif": true},
        {"title":"Myulis - FWAL RC","url":"https://myulis.test.fwal.uliege.be", "notif": true},
        {"title":"Myulis - FWB RC","url":"https://myulis.test.fwb.uliege.be", "notif": true},
        {"title":"Myulis - HYGEA RC","url":"https://myulis.test.hygea.uliege.be", "notif": true},
        {"title":"Myulis - IDEA RC","url":"https://myulis.test.idea.uliege.be", "notif": true},
        {"title":"Myulis - LIEA RC","url":"https://myulis.test.liea.uliege.be", "notif": true},
        {"title":"Myulis - PROV RC","url":"https://myulis.test.prov.uliege.be", "notif": true},
        {"title":"Myulis - SPW RC","url":"https://myulis.test.spw.uliege.be", "notif": true},
        {"title":"Myulis - ULG RC","url":"https://myulis.test.uliege.be", "notif": true},
        {"title":"Myulis - CESW","url":"https://myulis.cesw.uliege.be", "notif": true},
        {"title":"Myulis - ETNIC","url":"https://myulis.etnic.uliege.be", "notif": true},
        {"title":"Myulis - FWAL","url":"https://myulis.fwal.uliege.be", "notif": true},
        {"title":"Myulis - FWB","url":"https://myulis.fwb.uliege.be", "notif": true},
        {"title":"Myulis - HYGEA","url":"https://myulis.hygea.uliege.be", "notif": true},
        {"title":"Myulis - IDEA","url":"https://myulis.idea.uliege.be", "notif": true},
        {"title":"Myulis - LIEA","url":"https://myulis.liea.uliege.be", "notif": true},
        {"title":"Myulis - PROV","url":"https://myulis.prov.uliege.be", "notif": true},
        {"title":"Myulis - SPW","url":"https://myulis.spw.uliege.be", "notif": true},
        {"title":"Myulis - ULG","url":"https://myulis.uliege.be", "notif": true},
        {"title":"Myulis - PANA","url":"https://myulis.pana.uliege.be", "notif": true},
        {"title":"Myulis - PACO","url":"https://myulis.paco.uliege.be", "notif": true}
      ],
      credentials: null
    }
    await writeFile(userDataConfig, initConfigFile, false);
    dataToReturn = fs.readFileSync(userDataConfig, 'utf8');
    
  }
  return JSON.parse(dataToReturn);
})

async function getAllMyulisStatus() {
  let dataToReturn:any = JSON.parse(fs.readFileSync(userDataConfig, 'utf8'))
  let returnData:any = [];
  await Promise.all(dataToReturn.listApps.map(entry =>
    axiosInstance.get(entry.url + '/version').then(response => {
        
        // Vérifier si la réponse contient la page d'erreur de maintenance
        const responseText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const isMaintenancePage = responseText.includes('Maintenance du site en cours') || 
                                 responseText.includes('Une maintenance du site est en cours') ||
                                 responseText.includes('Nous revenons rapidement') ||
                                 responseText.includes('Merci de réessayer plus tard') ||
                                 responseText.includes('errors/503.html') ||
                                 responseText.includes('errors/502.html') ||
                                 responseText.includes('errors/50X.html');
        
        // Vérifier aussi si c'est du HTML au lieu de JSON
        const contentType = response.headers['content-type'] || '';
        const isHtmlResponse = contentType.includes('text/html');
        
        const actualStatus = (isMaintenancePage || isHtmlResponse) ? 503 : response.status;
        
        returnData.push({ 
          status: actualStatus, 
          url: entry.url, 
          title: entry.title, 
          response: actualStatus !== 200 ? 'Une erreur a été détecté' : response.data, 
          notif: entry.notif 
        });
    }).catch(error => {
        returnData.push({ status: error.response ? error.response.status : 500, url: entry.url, title: entry.title, response: error.message, notif: entry.notif });
    })
  ));
  let listAppsInError = returnData.filter(entry => entry.status !== 200 && entry.notif);

  displayNotification(listAppsInError);

  return {status: 'OK', data: returnData};
}

function displayNotification(listAppsInError){
    if(listAppsInError.length > 0){
        if(listAppsInError.length < 10){
            new Notification({
                icon: nativeImage.createFromPath(app.getAppPath() + '/static/icon.png'),
                title: 'Erreur sur myUlis !',
                body: 'Il y\'a ' + listAppsInError.length + ' myUlis KO !'
            }).show()
            mainWindow.setOverlayIcon(nativeImage.createFromPath(app.getAppPath() + '/static/notification-' + listAppsInError.length + '.png'), 'Y a ' + listAppsInError.length + ' erreur frerot !');
        }else{
            new Notification({
                icon: nativeImage.createFromPath(app.getAppPath() + '/static/icon.png'),
                title: 'On peut plus rien faire pour toi frerot !',
                body: 'Il y\'a plus de KO que de truc qui tourne...'
            }).show()
            mainWindow.setOverlayIcon(nativeImage.createFromPath(app.getAppPath() + '/static/notification-peuplusrienfaire.png'), 'Y a 10 erreurs frerot !');
        }
    }else{
        mainWindow.setOverlayIcon(null, '')
    }
}

async function writeFile(fileName, content, isFormated){
  if(!isFormated){
    content = JSON.stringify(content);
  }
  fs.writeFileSync(fileName, content)
}