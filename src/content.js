import './content.scss'
import Observer from "./lib/Observer"
import Log from "./lib/Log"
import Message from "./lib/Message"

class LaracastsContent {
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

LaracastsContent.start()
