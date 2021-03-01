import Config from "./config.js"
import Thread from "./thread.js"
import Log from "../both/log.js"

class Notify {
    static start () {
        chrome.notifications.onClicked.addListener(this.onClick.bind(this))
        chrome.notifications.onClosed.addListener(this.onClose.bind(this))
    }

    static async create (id = null, data, callback = () => {}) {

        const exists = await new Promise(resolve => chrome.notifications.getAll(notifications => {
            if (notifications.hasOwnProperty(id)) {
                resolve(true)
            }
            resolve(false)
        }))

        if (!exists) {
            return await new Promise(resolve => chrome.notifications.create(id, data, () => resolve(true)))
        }

        return false
    }

    static onClick (id) {
        Log('goto', id)
        chrome.notifications.clear(id)
        const url = Config.host + id
        chrome.tabs.create({ url })
        Thread.update(url, { updated_at: new Date().toISOString() })
    }

    static onClose (id) {
        Log('closed', id)
        chrome.notifications.clear(id)
        const url = Config.host + id
        Thread.update(url, { updated_at: new Date().toISOString() })
    }

    static test () {
        Notify.create('/discuss', {
            title: 'Notify example',
            requireInteraction: true,
            message: '@trin: Hello fellows! How are u doing?',
            iconUrl: '/image/laracasts.svg',
            type: 'basic',
        })
    }
}

export default Notify
