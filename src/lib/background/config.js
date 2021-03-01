import Log from "../both/log.js"

class Config {
    static host = 'https://laracasts.com'
    static enabled = true
    static interval = 30000
    static debug = true
    static startTime = null
    static trashTime = 86400 * 3 * 1000

    static purePath (path, addslashes = true) {
        if (path.substr(0, 1) === '/') {
            path = this.host + path
        }
        const url = new URL(path)
        let pathname = url.pathname
        if (addslashes) {
            pathname.replace('/', '\\/')
        }
        return pathname
    }

    static async load () {
        return new Promise((resolve) => chrome.storage.local.get(['config'], result => {
            if (result['config']) {
                Object.entries(result['config']).map(item => {
                    this[item[0]] = item[1]
                })
            }
            resolve({
                enabled: this.enabled,
                trashTime: this.trashTime
            })
        }))
    }

    static async save (data) {
        Log('save config', data)
        data = {
            ...{
                enabled: this.enabled,
                trashTime: this.trashTime
            },
            ...data
        }
        return new Promise((resolve) => chrome.storage.local.set({ 'config': data }, result => {
            Object.entries(data).map(item => {
                this[item[0]] = item[1]
            })
            resolve(data)
        }))
    }
}

Config.startTime = new Date()

export default Config
