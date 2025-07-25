// preload.js (Node context, runs before renderer)
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  chrome: () => process.versions.chrome,
  node: () => process.versions.node,
  electron: () => process.versions.electron,

  isBraveInstalled: () => ipcRenderer.invoke("is-brave-installed"),

  //  get movies/webseries list

  getMoviesList: (url) => ipcRenderer.invoke("get-movies-list", url),

  //  get packs list

  getPacksList: (url) => ipcRenderer.invoke("get-packs-list", url),

  // get hubcloud download links

  getHubCloudDownloadLinks: (url) => ipcRenderer.invoke("get-download-link", url),

});
