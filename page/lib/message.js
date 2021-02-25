import Log from "../../lib/log.js"

const extensionId = 'bngbhijbcgoiodnhonfkojgbmiljhjnj'

class Message {
    static async send (action, data) {
        Log('send message', action, data)

        return new Promise(resolve => chrome.runtime.sendMessage(extensionId, { action, data }, response => {
            Log('get answer', action, data, response)
            resolve(response)
        }))
    }
}

export default Message
