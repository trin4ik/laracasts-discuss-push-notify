import Log from "./lib/Log"
import Request from "./lib/Request"
import User from "./lib/User"
import Notify from "./lib/Notify"
import Config from "./lib/Config"
import Thread from "./lib/Thread"
import Category from "./lib/Category"

class LaracastsBackground {

    static async start () {
        Log('start')
        Request.start()
        await User.fetch()
        Notify.start()
        await Category.load()
        await Category.refresh()
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
}

LaracastsBackground.start()
