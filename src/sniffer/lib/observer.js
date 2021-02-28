import camelCase from "../../vendor/lodash/camelCase.js"
import Log from "../../lib/log.js"
import Message from "./message.js"

class Observer {

    static _isActiveButton = false
    static onChangeActive = new Event('active')

    static set isActiveButton (value) {
        this._isActiveButton = value
        Log('set active button', value)
        this.observer.map(item => {
            if (item.item) {
                Log('ooooooooo', item.item)
                item.item.dispatchEvent(this.onChangeActive);
            }
        })
        return this._isActiveButton
    }

    static get isActiveButton () {
        return this._isActiveButton
    }

    static observer = [
        {
            name: 'side-menu',
            selector: '.lg\\:tw-self-start form',
            permanent: false
        },
        {
            name: 'reply',
            selector: 'div[role=dialog].conversation-modal',
            permanent: true
        }
    ]

    static async checkActiveButton () {
        const active = await Message.send('check-notify', location.pathname)
        return active.data
    }

    static async handlerClick () {
        const result = await Message.send('notify-click', location.pathname)
        Log('click', result)
        this.isActiveButton = result.data
    }

    static observeSideMenu () {
        Log('side menu')
        document.querySelector('.lg\\:tw-self-start form button').innerHTML = 'follow by email'
        document.querySelector('.lg\\:tw-self-start form button').classList.remove('tw-mb-8')
        document.querySelector('.lg\\:tw-self-start form button').classList.add('tw-mb-4')
        const buttonNotify = document.createElement('button')
        buttonNotify.className = 'tw-btn tw-btn-outlined tw-bg-transparent tw-border-blue-light tw-text-blue-light tw-w-full tw-mb-8 tw-max-w-2xs'
        buttonNotify.addEventListener('click', () => this.handlerClick())
        buttonNotify.addEventListener('active', async () => {
            const active = await this.checkActiveButton()
            if (active) {
                buttonNotify.classList.add('active')
                buttonNotify.innerHTML = 'unfollow by push'
            } else {
                buttonNotify.classList.remove('active')
                buttonNotify.innerHTML = 'follow by push'
            }
        })
        buttonNotify.dispatchEvent(this.onChangeActive);

        document.querySelector('.lg\\:tw-self-start form').after(buttonNotify)
        return buttonNotify
    }

    static observeReply () {
        if (document.querySelector('div[role=dialog].conversation-modal .mobile\\:tw-hidden')) {
            if (!document.querySelector('.follow-by-push-reply')) {
                const follow = document.createElement('div')
                follow.className = 'follow-by-push-reply'
                follow.innerHTML = '<label><span class="switch tw-mr-2 size-small"><input type="checkbox" /> <div class="slider round"></div></span> Follow by push</label>'
                follow.querySelector('label').addEventListener('click', (e) => {
                    e.preventDefault()
                    this.handlerClick()
                })
                follow.addEventListener('active', async () => {
                    const active = await this.checkActiveButton()
                    if (active) {
                        follow.querySelector('input').checked = true
                    } else {
                        follow.querySelector('input').checked = false
                    }
                })
                follow.dispatchEvent(this.onChangeActive);
                document.querySelector('div[role=dialog].conversation-modal > div > div').before(follow)
                return follow
            }
        }
    }

    static async start () {
        this.observer.map(item => {
            if (typeof this[camelCase('observe-' + item.name)] === 'function') {
                item.started = true
                item.observer = new MutationObserver(async () => {
                    console.log('observe')
                    if (document.querySelector(item.selector)) {
                        const observable = this[camelCase('observe-' + item.name)]()
                        if (observable) {
                            item.item = observable
                        }
                        if (!item.permanent) {
                            item.observer.disconnect()
                        }
                    }
                })
                item.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                })
            }
        })
    }
}

export default Observer
