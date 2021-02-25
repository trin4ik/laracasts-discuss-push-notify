import Config from '../lib/config.js'
import Thread from '../lib/thread.js'
import Notify from '../lib/notify.js'
import Log from '../lib/log.js'
import Request from '../lib/request.js'
import User from "../lib/user.js"

class LaravelNotify {

    static async start () {
        Log('start')
        await Config.start()
        await User.fetch()
        Request.start()
        Notify.start()
        await this.refresh()
    }

    static async refresh () {
        const table = []
        await Config.load()
        Log('refresh', Config.enabled)
        if (Config.enabled) {
            const list = await Thread.list()
            Log('refresh, count item:', list.length)
            await Promise.all(list.map(async item => {
                if (new Date() - new Date(item.updated_at) >= Config.trashTime) {
                    // remove old thread
                    await Thread.remove(item.path)
                    return
                }

                const thread = await Thread.fetch(item.path)
                if (thread) {
                    table.push({
                        'old thread': item,
                        'new thread': thread,
                        'old date': new Date(item.updated_at),
                        'new date': new Date(thread.updated_at),
                        'date diff': (new Date(thread.updated_at) - new Date(item.updated_at))
                    })
                    await Thread.notify(thread)
                } else {
                    Log.error('error item, cant fetch', item)
                }
            }))

            Log.table(table)
        }
        setTimeout(() => this.refresh(), Config.interval)
    }

    static async checkNewPost () {
        if (this.enabled) {
            await Promise.all(this.threads.map(async item => {
                if (new Date() - new Date(item.updated_at) >= 86400 * 1000 * 7) {
                    this.threads.removeThread(item.uri)
                    return
                }
                console.log('check item', item)
                try {
                    const result = await fetch('https://laracasts.com' + item.uri, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                    const json = await result.json()
                    console.log('check post', item, json, new Date(item.updated_at), new Date(json.updated_at), new Date(json.updated_at) - new Date(item.updated_at))
                    if (new Date(json.updated_at) - new Date(item.updated_at) > 0) {
                        this.createNotify(json)
                    }
                } catch (e) {
                    console.log('error item', item, e)
                }
            }))
        }
        setTimeout(this.checkNewPost.bind(this), this.interval)
    }

    static createNotify (json) {

        let id = ''
        let lastReplie = json
        while (
            lastReplie.hasOwnProperty('replies') &&
            (
                (
                    lastReplie.replies.hasOwnProperty('data') &&
                    lastReplie.replies.data.length
                ) ||
                lastReplie.replies.length
            )
            ) {
            if (lastReplie.replies.hasOwnProperty('data')) {
                lastReplie = lastReplie.replies.data[lastReplie.replies.data.length - 1]
            } else {
                lastReplie = lastReplie.replies[lastReplie.replies.length - 1]
            }
            id = lastReplie.path
        }
        const data = {
            title: json.title,
            requireInteraction: true,
            message: '@' + json.last_reply_username + ': ' + lastReplie.body_in_markdown,
            iconUrl: 'laracasts.svg',
            type: 'basic',
        }

        console.log('ololo', id, lastReplie, data)

        Notify.create()
        chrome.notifications.clear(id)
        chrome.notifications.create(id, data, () => {
            console.log('callback notify')
        })
    }

    static onMessage (request, sender, sendResponse) {
        const result = {
            success: false,
            error: 'unknown'
        }

        console.log('message', request, sender)

        if (sender.tab) {
            switch (request.action) {
                case 'notify-click': {
                    console.log('notify click', this.threads.find(item => item.uri === request.data.uri))
                    if (this.threads.find(item => item.uri === request.data.uri)) {
                        this.removeThread(request.data.uri)
                        result.success = true
                        result.data = false
                    } else {
                        this.addThread(request.data)
                        result.success = true
                        result.data = true
                    }
                    break
                }
                case 'check-notify': {
                    result.success = true
                    result.data = this.threads.find(item => item.uri === request.data)
                    break
                }
            }
        }


        if (result.success) {
            delete result.error
        }

        sendResponse(result)
    }

    static updateThread (id, data) {
        let thread = this.threads.findIndex(item => item.uri === id)
        console.log('update thread', id, data, thread)
        if (thread !== -1) {
            this.threads[thread] = { ...this.threads[thread], ...data }
            chrome.storage.sync.set({ 'thread:list': this.threads })
        }
        console.log('new threads', this.threads)
    }

    static removeThread (uri) {
        const newThreads = [...this.threads.filter(item => item.uri !== uri)]
        this.threads = newThreads
        chrome.storage.sync.set({ 'thread:list': newThreads })
    }

    static addThread (data) {
        const newThreads = [...this.threads, data]
        this.threads = newThreads
        chrome.storage.sync.set({ 'thread:list': newThreads })
    }
}

LaravelNotify.start()

