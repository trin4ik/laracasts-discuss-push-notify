import Config from "./Config"
import Thread from "./Thread"
import Log from "./Log"

class Notify {
    static start () {
        browser.notifications.onClicked.addListener(id => this.onClick(id))
        browser.notifications.onClosed.addListener(id => this.onClose(id))
    }

    static async create (id = null, data, callback = () => {}) {

        const all = await browser.notifications.getAll()
        if (!all.hasOwnProperty(id)) {
            await browser.notifications.create(id, data)
            return true
        }
        return false
    }

    static onClick (id) {
        Log('goto', id)
        browser.notifications.clear(id)
        const url = Config.host + id
        browser.tabs.create({ url })
        Thread.update(url, { updated_at: new Date().toISOString() })
    }

    static onClose (id) {
        Log('closed', id)
        browser.notifications.clear(id)
        const url = Config.host + id
        Thread.update(url, { updated_at: new Date().toISOString() })
    }

    static test () {
        const data = {
            title: 'Notify example',
            message: '@trin: Hello fellows! How are u doing?',
            iconUrl: browser.runtime.getURL("image/48.png"),
            type: 'basic',
        }

        if (ENGINE !== 'firefox') {
            data.requireInteraction = true
        }

        Notify.create('/discuss', data)
    }
}

export default Notify
