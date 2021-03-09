import Log from "./Log"

class Message {

    static async send (action = null, data = {}) {
        Log('send message3', action, data)
        const result = await browser.runtime.sendMessage({ action, data: JSON.parse(JSON.stringify(data)) })
        Log('send message result', result)
        return result
    }
}

export default Message
