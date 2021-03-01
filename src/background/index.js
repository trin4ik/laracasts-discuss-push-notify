import Config from '../lib/background/config'
import Thread from '../lib/background/thread'
import Notify from '../lib/background/notify'
import Log from '../lib/both/log'
import Request from '../lib/background/request'
import User from "../lib/background/user"

class LaravelNotify {

    static async start () {
        Log('start')
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
}

LaravelNotify.start()
