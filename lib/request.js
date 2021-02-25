import Log from './log.js'
import camelCase from '../vendor/lodash/camelCase.js'
import Thread from "./thread.js"
import Config from "./config.js"
import User from "./user.js"

class Request {
    static start () {
        chrome.runtime.onMessageExternal.addListener(this.onMessage.bind(this))
        chrome.runtime.onMessage.addListener(this.onMessage.bind(this))
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
        if (sender.tab) {
            if (typeof this[camelCase('action-' + request.action)] === 'function') {
                try {
                    this[camelCase('action-' + request.action)](request, sender, sendResponse)
                } catch (e) {
                    this.messageResult({ success: false, error: e }, { sendResponse, request })
                }
            } else {
                this.messageResult({ success: false, error: 'unknown action "' + request.action + '"' }, { sendResponse, request })
            }
        } else {
            this.messageResult({ success: false, error: 'no sender tab' }, { sendResponse, request })
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
