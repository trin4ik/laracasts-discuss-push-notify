import './index.scss'
import Observer from "../lib/page/observer"
import Log from "../lib/both/log"

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
