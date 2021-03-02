import Log from "./Log"
import Config from "./Config"

class User {
    static user = null
    static username = null

    static set (data) {
        Object.entries(data).map(item => {
            if (this.hasOwnProperty(item[0])) {
                this[item[0]] = item[1]
            }
        })
        Log('set user', data)
    }

    static async fetch () {
        const result = await fetch(Config.host + '/discuss', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        const body = await result.text()
        const user = body.match(/window\.LARACASTS\s*=\s*([^;]+);/)
        if (user && user.length && user.length === 2) {
            const getUser = JSON.parse(user[1])
            Log('check user', getUser)
            if (getUser.user && getUser.signedIn) {
                this.set(JSON.parse(user[1]))
            }
        }
    }
}

export default User
