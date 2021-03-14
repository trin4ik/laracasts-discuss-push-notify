import Config from "./Config"
import Log from "./Log"
import Thread from "./Thread"
import Notify from "./Notify"

class Category {
    static  REGEXP = /<a\s*href="([^"]+)"[^>]*>([^<]+)<\/a>\s*<\/h4>\s*<div[^>]*>\s*<a[^>]*>\s*([^\n]+)\n<\/a>/gm
    static cache = []
    static lastTime = null
    static list = {
        'assistance': {
            title: 'Assistance',
            enabled: false,
            background: '#8cd36299'
        },
        'eloquent': {
            title: 'Eloquent',
            enabled: false,
            background: '#09d7c199'
        },
        'envoyer': {
            title: 'Envoyer',
            enabled: false,
            background: '#F5685799'
        },
        'feedback': {
            title: 'Feedback',
            enabled: false,
            background: '#88AD4899'
        },
        'forge': {
            title: 'Forge',
            enabled: false,
            background: '#5db3b799'
        },
        'general': {
            title: 'General',
            enabled: true,
            background: '#4E89DA99'
        },
        'guides': {
            title: 'Guides',
            enabled: false,
            background: '#D51E2299'
        },
        'javascript': {
            title: 'JavaScript',
            enabled: false,
            background: '#9AD4E099'
        },
        'laravel': {
            title: 'Laravel',
            enabled: true,
            background: '#F5685799'
        },
        'livewire': {
            title: 'Livewire',
            enabled: false,
            background: '#FB70A999'
        },
        'lumen': {
            title: 'Lumen',
            enabled: true,
            background: '#F9A97A99'
        },
        'mix': {
            title: 'Mix',
            enabled: false,
            background: '#f7c95399'
        },
        'nova': {
            title: 'Nova',
            enabled: false,
            background: '#2C425D66',
        },
        'requests': {
            title: 'Requests',
            enabled: false,
            background: '#BB824E99'
        },
        'servers': {
            title: 'Servers',
            enabled: false,
            background: '#F9A97A99'
        },
        'spark': {
            title: 'Spark',
            enabled: false,
            background: '#66add399'
        },
        'testing': {
            title: 'Testing',
            enabled: false,
            background: '#da575799'
        },
        'tips': {
            title: 'Tips',
            enabled: false,
            background: '#837eb699'
        },
        'vapor': {
            title: 'Vapor',
            enabled: false,
            background: '#25C4F299'
        },
        'vue': {
            title: 'Vue',
            enabled: false,
            background: '#3ab98199'
        }
    }

    static async load () {

        const categories = (await browser.storage.local.get(['categories']))['categories']
        if (categories) {
            Object.entries(categories).map(item => {
                this.list[item[0]].enabled = item[1] === true ?? false
            })
        }
        return this.toJson
    }

    static async save (data) {
        let newList = { ...this.toJson }
        await browser.storage.local.set({ 'categories': data })
        Object.entries(data).map(item => {
            newList[item[0]].enabled = item[1]
        })
        this.list = newList
        return newList
    }

    static async refresh () {
        await this.load()
        let count = 0

        Log('refresh category', Object.entries({ ...this.list }).map(item => {
            if (item[1].enabled) {
                return { [item[0]]: item[1].enabled }
            }
            return false
        }).filter(item => item))

        const result = await fetch(Config.host + '/discuss', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        const body = await result.text()
        let threads = body.matchAll(this.REGEXP)
        for (const match of threads) {
            if (match.length) {
                const list = Object.entries(this.list)
                for (const x in list) {
                    const item = list[x]
                    if (item[1].enabled && item[1].title === match[3]) {
                        let cache = this.cache.find(item => item.path === match[1])
                        if (!cache) {
                            const thread = await Thread.fetch(match[1])
                            cache = {
                                path: match[1],
                                data: thread,
                                created_at: thread.created_at
                            }
                            this.cache.push(cache)
                        }

                        if (new Date(cache.created_at) > this.lastTime) {
                            count++
                            const notify = {
                                title: 'New thread in "' + item[1].title + '"',
                                message: cache.data.title,
                                iconUrl: browser.runtime.getURL("image/48.png"),
                                type: 'basic',
                            }
                            if (ENGINE !== 'firefox') {
                                notify.requireInteraction = true
                            }

                            await Notify.create(cache.path, notify)
                        }
                    }
                }

            }
        }
        this.lastTime = new Date()
        Log('refresh category, count item', count)
        setTimeout(this.refresh.bind(this), Config.refreshCategoryInterval)
    }

    static get toJson () {
        return this.list
    }
}

Category.lastTime = new Date()

export default Category
