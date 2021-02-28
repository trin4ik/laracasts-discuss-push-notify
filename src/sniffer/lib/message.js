import Log from "../../lib/log.js"

class Message {
    static async send (action, data) {
        Log('send message', action, data, extensionId)

        return new Promise(resolve => chrome.runtime.sendMessage(extensionId, { action, data }, response => {
            Log('get answer', action, data, response)
            resolve(response)
        }))
    }
}

export default Message
