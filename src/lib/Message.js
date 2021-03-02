import Log from "./Log"

class Message {

    static async send (action = null, data = {}) {
        Log('send message', action, data)
        const result = await browser.runtime.sendMessage({ action, data })
        Log('send message result', result)
        return result
    }
}

export default Message
