import Log from "./Log"

class Config {
    static host = 'https://laracasts.com'
    static enabled = true
    static interval = 30000
    static refreshCategoryInterval = 60000
    static debug = true
    static startTime = null
    static trashTime = 86400 * 3 * 1000
    static sound = {
        enabled: true,
        volume: .5,
        file: 'image/notify.mp3'
    }

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

        const config = (await browser.storage.local.get(['config']))['config']
        if (config) {
            Object.entries(config).map(item => {
                if (!this.toJson.hasOwnProperty(item[0])) return
                if (item[0] === 'sound') {
                    item[1].file = 'image/notify.mp3'
                }
                this[item[0]] = item[1]
            })
        }
        return this.toJson
    }

    static async save (data) {
        Log('save config', data)
        data = {
            ...this.toJson,
            ...data
        }

        await browser.storage.local.set({ 'config': data })
        Object.entries(data).map(item => {
            this[item[0]] = item[1]
        })

        return data
    }

    static get toJson () {
        return {
            host: this.host,
            enabled: this.enabled,
            interval: this.interval,
            debug: this.debug,
            trashTime: this.trashTime,
            sound: this.sound
        }
    }
}

Config.startTime = new Date()
export default Config
