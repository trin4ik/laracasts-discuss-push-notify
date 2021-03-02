import camelCase from 'lodash/camelCase'
import Log from "../Log"

class Request {
    static start () {
        browser.runtime.onMessage.addListener((...args) => this.onMessage(...args))
    }

    static async onMessage (request, sender) {
        Log('new message', request, sender)
        if (!request.action || typeof this[camelCase(request.action)] !== 'function') {
            callback({
                success: false,
                data: 'no action'
            })
        }
        try {
            Log('call this.' + camelCase(request.action), request.data)
            const data = await this[camelCase(request.action)](request.data, sender)
            return this.sendResponse(true, data)
        } catch (error) {
            return this.sendResponse(false, error)
        }
    }

    static sendResponse (success, data) {
        Log('send response', success, data)
        return { success, data }
    }
}

export default Request
