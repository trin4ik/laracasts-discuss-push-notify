import Config from "./Config"
import Log from "./Log"
import Notify from "./Notify"
import User from "./User"

class Thread {
    static async list () {
        const list = (await browser.storage.local.get(['thread:list']))['thread:list']
        return list ?? []
    }

    static async find (data) {
        const list = await this.list()
        return list.find(data)
    }

    static async remove (uri) {
        let list = await this.list()
        list = list.filter(item => item.path !== Config.purePath(uri))
        Log('remove thread', uri, list)
        await browser.storage.local.set({ 'thread:list': list })
        return true
    }

    static async update (id, data) {
        const list = await this.list()

        const item = list.findIndex(item => {
            Log(item.id, id, item.path, Config.purePath(id))
            return item.id === id || item.path === Config.purePath(id)
        })
        list[item] = { ...list[item], ...data }

        await browser.storage.local.set({ 'thread:list': list })

        return item
    }

    static async create (data) {
        const list = await this.list()

        if (!list.find(item => item.id === data.id)) {
            list.push(data)
        }

        await browser.storage.local.set({ 'thread:list': list })
        return true
    }

    static async fetch (url) {
        try {
            const result = await fetch(Config.host + Config.purePath(url), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
            return await result.json()
        } catch (e) {
            return false
        }
    }

    static async notify (newItem) {
        const item = await Thread.find(item => item.id === newItem.id)
        if (item) {
            if (new Date(newItem.updated_at) - new Date(item.updated_at) > 0) {

                const lastReplie = this.getLastReplie(newItem)
                if (lastReplie) {
                    if (User.username && User.username !== lastReplie.user.username) {
                        const data = {
                            title: item.title,
                            message: '@' + lastReplie.user.username + ': ' + lastReplie.body_in_markdown,
                            iconUrl: browser.runtime.getURL("image/48.png"),
                            type: 'basic',
                        }
                        if (ENGINE !== 'firefox') {
                            data.requireInteraction = true
                        }

                        await Notify.create(lastReplie.path, data)
                    }
                }
            }
        }
        return false
        //Notify.create(notifyData)
    }

    static getLastReplie (item) {
        let last = null
        let replies = this.getFlatReplies(item.replies.data)

        replies.map(item => {
            if (last === null || new Date(item.updated_at) > new Date(last.updated_at)) {
                last = item
            }
        })

        return last
    }

    static getFlatReplies (replies = []) {
        const result = []
        replies.map(item => {
            result.push(item, ...this.getFlatReplies(item.replies))
        })

        return result
    }
}

export default Thread
