import RequestParent from "./extends/Request"
import Config from "./Config"
import Thread from "./Thread"
import Notify from "./Notify"
import Log from "./Log"
import Category from "./Category"

class Request extends RequestParent {

    static async loadConfig () {
        return Config.toJson
    }

    static async saveConfig (data) {
        return await Config.save(data)
    }

    static async loadCategories () {
        return Category.toJson
    }

    static async saveCategories (data) {
        return await Category.save(data)
    }

    static async testNotify () {
        await Notify.test()
        return true
    }

    static async loadThreads () {
        return await Thread.list()
    }

    static async removeThread (data) {
        return await Thread.remove(data.path)
    }

    static async checkNotify (data) {
        const item = await Thread.find(item => item.path === Config.purePath(data))
        return item ? true : false
    }

    static async notifyClick (data) {
        const exists = await Thread.find(item => item.path === Config.purePath(data))
        if (exists) {
            await Thread.remove(data)
            return false
        } else {
            const item = await Thread.fetch(data)
            Log('item fetch', item)
            if (item) {
                await Thread.create(item)
                return true
            } else {
                throw 'no thread'
            }
        }
    }
}

export default Request
