import Log from "../both/log"

class Message {
    static async send (action, data) {
        Log('send message', action, data)

        return new Promise(resolve => chrome.runtime.sendMessage({ action, data }, response => {
            Log('get answer', action, data, response)
            resolve(response)
        }))
    }
}

export default Message
