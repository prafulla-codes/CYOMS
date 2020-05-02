const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'cyoms-win32-ia32/'),
    authors: 'Prafulla Raichurkar',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'CYOMS.exe',
    setupExe: 'CYOMS_Setup.exe',
    setupIcon: path.join(rootPath, 'resources', 'icons','favicon.ico')
  })
}