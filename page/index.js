import Observer from "./lib/observer.js"
import Log from "../lib/log.js"
import Config from "../lib/config.js"

class LaravelNotify {
    static async start () {
        if (this.checkUri()) {
            Log('uri match, sniff')
            await Observer.start()
        }
    }

    static checkUri () {
        return /^\/discuss\/channels\/([^\/]+)\/([^\/]+)$/.test(location.pathname)
    }
}

LaravelNotify.start()
