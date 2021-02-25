import Observer from "./lib/observer.js"
import Log from "../lib/log.js"
import Message from "./lib/message.js"

class LaravelNotify {
    static async start () {
        Message.start()
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
