import Log from '../both/log'
import camelCase from 'lodash/camelCase'
import Thread from "./thread"
import Config from "./config"
import User from "./user"
import Notify from "./notify"

class Request {
    static start () {
        chrome.runtime.onMessageExternal.addListener(this.onMessage.bind(this))
        chrome.runtime.onMessage.addListener(this.onMessage.bind(this))
    }

    static async actionRemoveThread (request, sender, sendResponse) {
        const remove = await Thread.remove(request.data.path)
        this.messageResult({
            success: true, data: remove
        }, { request, sendResponse })
    }

    static async actionTestNotify (request, sender, sendResponse) {
        await Notify.test()
        this.messageResult({
            success: true, data: true
        }, { request, sendResponse })
    }

    static async actionLoadThreads (request, sender, sendResponse) {
        const list = await Thread.list()
        this.messageResult({
            success: true, data: list
        }, { request, sendResponse })
    }

    static async actionLoadConfig (request, sender, sendResponse) {
        this.messageResult({
            success: true, data: {
                enabled: Config.enabled,
                host: Config.host
            }
        }, { request, sendResponse })
    }

    static async actionSaveConfig (request, sender, sendResponse) {
        const result = await Config.save({ enabled: request.data.enabled })
        this.messageResult({ success: true, data: result }, { request, sendResponse })
    }

    static async actionNotifyClick (request, sender, sendResponse) {
        const exists = await Thread.find(item => item.path === Config.purePath(request.data))
        if (exists) {
            await Thread.remove(request.data)
            this.messageResult({ success: true, data: false }, { request, sendResponse })
        } else {
            const item = await Thread.fetch(request.data)
            if (item) {
                await Thread.create(item)
                this.messageResult({ success: true, data: true }, { request, sendResponse })
            } else {
                this.messageResult({ success: false }, { request, sendResponse })
            }
        }
    }

    static async actionSetUser (request, sender, sendResponse) {
        User.set(request.data)
    }

    static async actionCheckNotify (request, sender, sendResponse) {
        let item = await Thread.find(item => {
            return item.path === Config.purePath(request.data)
        })
        this.messageResult({ success: true, data: item ? true : false }, { sendResponse, request })
    }

    static onMessage (request, sender, sendResponse) {

        Log('get message', request.action, request, sender)
        if (typeof this[camelCase('action-' + request.action)] === 'function') {
            try {
                this[camelCase('action-' + request.action)](request, sender, sendResponse)
            } catch (e) {
                this.messageResult({ success: false, error: e }, { sendResponse, request })
            }
        } else {
            this.messageResult({ success: false, error: 'unknown action "' + request.action + '"' }, { sendResponse, request })
        }

        return true

    }

    static messageResult (data, options) {

        const { sendResponse = false, request = {} } = options

        Log('send response', request.action, data)

        if (sendResponse) {
            sendResponse(data)
        }
    }
}

export default Request
