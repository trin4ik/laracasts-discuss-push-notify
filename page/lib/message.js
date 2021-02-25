import Log from "../../lib/log.js"
import Config from "../../lib/config.js"

class Message {

    static async send (action, data) {
        Log('send message', action, data)

        return new Promise(resolve => chrome.runtime.sendMessage(Config.extensionID, { action, data }, response => {
            Log('get answer', action, data, response)
            resolve(response)
        }))
    }
}

export default Message
