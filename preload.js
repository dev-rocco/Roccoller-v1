const { contextBridge, ipcRenderer } = require("electron");

// Expose only protected methods
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            let validChannels = ["cfgRequest"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["cfgReturn"];
            if (validChannels.includes(channel)) {
                // Strip event as it includes sender
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);